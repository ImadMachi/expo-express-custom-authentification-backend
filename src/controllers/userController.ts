import { Request, Response } from "express";
import userService from "../services/userService";
import mailerService from "../services/mailerService";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";

interface RegisterUserRequestBody {
	name: string;
	email: string;
	password: string;
}
export const registerUser = async (req: Request<{}, {}, RegisterUserRequestBody>, res: Response) => {
	try {
		const { name, email, password } = req.body;

		const user = await userService.createUser(name, email, password);

		await mailerService.sendVerificationEmail(user.email, user.verificationCode);

		res.status(200).json({ message: "User registered successfully", success: true });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user" });
	}
};

interface LoginUserRequestBody {
	email: string;
	password: string;
}
export const loginUser = async (req: Request<{}, {}, LoginUserRequestBody>, res: Response) => {
	try {
		const { email, password } = req.body;
		const { user, token } = await userService.signinUser(email, password);
		console.log(token);

		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Error logging in user" });
	}
};

interface VerifyUserRequestBody {
	code: string;
}
export const verifyUser = async (req: Request<{}, {}, VerifyUserRequestBody>, res: Response) => {
	try {
		const { code } = req.body;
		const { user, token } = await userService.verifyUser(code);

		res.status(200).json({ user, token });
	} catch (error) {
		console.error("Error verifying email:", error);
		res.status(500).json({ message: "Error verifying email" });
	}
};

interface ForgotPasswordBody {
	email: string;
}
export const forgotPassword = async (req: Request<{}, {}, ForgotPasswordBody>, res: Response) => {
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

interface ResetPasswordbody {
	newPassword: string;
}
export const resetPassword = async (req: Request<{}, {}, ResetPasswordbody>, res: Response) => {
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
