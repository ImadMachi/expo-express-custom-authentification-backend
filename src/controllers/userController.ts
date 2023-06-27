import { Request, Response } from "express";
import userService from "../services/userService";
import mailerService from "../services/mailerService";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		const user = await userService.createUser(firstName, lastName, email, password);

		await mailerService.sendVerificationEmail(user.email, user.verificationCode);

		res.status(200).json({ message: "User registered successfully", success: true });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user" });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const { user, token } = await userService.signinUser(email, password);

		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Error logging in user" });
	}
};

export const verifyUser = async (req: Request, res: Response) => {
	try {
		const { verificationCode } = req.body;
		const { user, token } = await userService.verifyUser(verificationCode);

		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Error verifying email:", error);
		res.status(500).json({ message: "Error verifying email" });
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const user = await userService.generateVerificationCode({ email });

		await mailerService.sendVerificationEmail(user.email, user.verificationCode);

		res.status(200).json({ message: "Password reset email sent" });
	} catch (error) {
		console.error("Error sending password reset email:", error);
		res.status(500).json({ message: "Error sending password reset email" });
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { newPassword } = req.body;
		const { _id } = req.user as HydratedDocument<IUser>;
		const { user } = await userService.resetPassword(_id, newPassword);

		res.status(200).json({ message: "Password resetted successfully", user });
	} catch (error) {
		console.error("Error resetting password:", error);
		res.status(500).json({ message: "Error resetting password" });
	}
};
