import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/User";
import generateCode from "../utils/generateCode";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import httpStatus from "../utils/httpStatus";

class UserService {
	private userModel: typeof User;

	constructor(userModel: typeof User) {
		this.userModel = userModel;
	}

	async createUser(firstName: string, lastName: string, email: string, password: string) {
		const user: IUser = new this.userModel({ firstName, lastName, email, password });

		return this.generateVerificationCode(user.email);
	}

	async signinUser(email: string, password: string) {
		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw createHttpError(httpStatus.UNAUTHORIZED, "Invalid email or password");
		}

		const isMatch = bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw createHttpError(httpStatus.UNAUTHORIZED, "Invalid email or password");
		}

		if (!user.verified) {
			throw createHttpError(httpStatus.FORBIDDEN, "User not verified");
		}

		const token = this.generateAuthToken(user._id);

		return { user, token };
	}

	async verifyUser(code: string) {
		const user = await this.userModel.findOne({ verificationCode: code });

		if (!user) {
			throw createHttpError(httpStatus.BAD_REQUEST, "Invalid verification code");
		}

		if (user.verificationCodeExpiresAt < new Date()) {
			throw createHttpError(httpStatus.UNAUTHORIZED, "Verification code expired");
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

	async generateVerificationCode(email: string) {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw createHttpError(httpStatus.NOT_FOUND, "User not found");
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
			throw createHttpError(httpStatus.NOT_FOUND, "User not found");
		}

		user.password = newPassword;

		await user.save();

		return { user };
	}
}

export default new UserService(User);
