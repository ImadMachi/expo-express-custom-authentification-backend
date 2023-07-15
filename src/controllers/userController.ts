import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import mailerService from "../services/mailerService";
import abilities from "../auth/abilities";
import { subject } from "@casl/ability";
import createHttpError from "http-errors";
import httpStatus from "../utils/httpStatus";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		const user = await userService.createUser(firstName, lastName, email, password);

		await mailerService.sendVerificationEmail(user.email, user.verificationCode);

		res.status(200).json({ message: "User registered successfully" });
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const { user, token } = await userService.signinUser(email, password);

		res.status(200).json({ user, token });
	} catch (error) {
		next(error);
	}
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { verificationCode } = req.body;
		const { user, token } = await userService.verifyUser(verificationCode);

		res.status(200).json({ user, token });
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email } = req.body;

		const user = await userService.generateVerificationCode(email);

		await mailerService.sendVerificationEmail(user.email, user.verificationCode);

		res.status(200).json({ message: "Password reset email sent" });
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { newPassword } = req.body;
		const user = req.user;

		if (!user || !abilities(user).can("update", subject("User", user))) {
			throw createHttpError(httpStatus.UNAUTHORIZED, "Unauthorized");
		}

		await userService.resetPassword(user._id, newPassword);

		res.status(200).json({ user });
	} catch (error) {
		next(error);
	}
};
