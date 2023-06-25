import { Request, Response } from "express";
import User from "../models/User";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "../services/mailer";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		const user = new User({ name, email, password });

		const verificationToken = randomBytes(32).toString("hex");
		user.verificationToken = verificationToken;

		await user.save();
		const verificationLink = `http://localhost:8000/api/users/verify/${verificationToken}`;
		sendVerificationEmail(email, verificationLink);

		res.status(200).json({ message: "User registered successfully", success: true });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Error registering user" });
	}
};

export const loginUser = (req: Request, res: Response) => {
	// Implement login logic here
};

export const verifyEmail = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({ verificationToken: token });

		if (!user) {
			return res.status(404).json({ message: "Invalid verification token" });
		}

		user.verified = true;
		user.verificationToken = "";
		await user.save();

		res.status(200).json({ message: "Email verified successfully", success: true });
	} catch (error) {
		console.error("Error verifying email:", error);
		res.status(500).json({ message: "Error verifying email" });
	}
};
