import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/User";
import generateCode from "../utils/generateCode";
import { HydratedDocument, Types } from "mongoose";

class UserService {
	private userModel: typeof User;

	constructor(userModel: typeof User) {
		this.userModel = userModel;
	}

	async createUser(name: string, email: string, password: string) {
		const user: HydratedDocument<IUser> = new this.userModel({ name, email, password });

		return this.generateVerificationCode({ email: user.email });
	}

	async signinUser(email: string, password: string) {
		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw new Error("User not found");
		}

		if (!user.verified) {
			throw new Error("User not verified");
		}

		const isMatch = bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new Error("Incorrect password");
		}

		const token = this.generateAuthToken(user._id);

		return { user, token };
	}

	async verifyUser(code: string) {
		const user = await this.userModel.findOne({ verificationCode: code });

		if (!user) {
			throw new Error("Invalid verification code");
		}

		if (user.verificationCodeExpiresAt < new Date()) {
			throw new Error("Verification code expired");
		}

		user.verified = true;
		user.verificationCode = "";
		const token = this.generateAuthToken(user._id);

		await user.save();

		return { user, token };
	}

	generateAuthToken(userId: Types.ObjectId) {
		const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
		return token;
	}

	async generateVerificationCode({ email, providedUser }: { email?: string; providedUser?: HydratedDocument<IUser> }) {
		let user: HydratedDocument<IUser> | null;
		if (providedUser) {
			user = providedUser;
		} else {
			user = await this.userModel.findOne({ email });
		}
		if (!user) {
			throw new Error("User not found");
		}

		const verificationCode = generateCode();
		user.verificationCode = verificationCode;

		const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
		user.verificationCodeExpiresAt = expirationTime;

		return user.save();
	}

	async resetPassword(_id: Types.ObjectId, newPassword: string) {
		const user = await this.userModel.findById(_id);

		if (!user) {
			throw new Error("User not found");
		}

		user.password = newPassword;

		await user.save();

		return { user };
	}
}

export default new UserService(User);
