import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { IUser, UserRole } from "../models/User";
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
		const existingUser = await this.userModel.findOne({ email });

		if (existingUser) {
			throw createHttpError(httpStatus.BAD_REQUEST, "Email already in use");
		}

		const user: IUser = new this.userModel({ firstName, lastName, email, password });
		await user.save();
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

		const token = this.generateAuthToken(user._id, user.role, user.isVerified);

		return { user, token };
	}

	async verifyUser(code: string, email: string) {
		const user = await this.userModel.findOne({ email, verificationCode: code });

		if (!user) {
			throw createHttpError(httpStatus.BAD_REQUEST, "Invalid verification code");
		}

		if (user.verificationCodeExpiresAt < new Date()) {
			throw createHttpError(httpStatus.UNAUTHORIZED, "Verification code expired");
		}

		user.isVerified = true;
		user.verificationCode = "";
		user.verificationCodeExpiresAt = new Date();
		const token = this.generateAuthToken(user._id, user.role, user.isVerified);

		await user.save();

		return { user, token };
	}

	generateAuthToken(userId: Types.ObjectId, role: UserRole, isVerified: boolean) {
		const token = jwt.sign({ _id: userId, role, isVerified }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
		return token;
	}

	async generateVerificationCode(email: string) {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw createHttpError(httpStatus.NOT_FOUND, "No user with this email was found");
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

	async getCurrentUserById(_id: Types.ObjectId) {
		const user = await this.userModel.findById(_id);

		if (!user) {
			throw createHttpError(httpStatus.NOT_FOUND, "User not found");
		}
		return user;
	}
}

export default new UserService(User);
