import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	verified: boolean;
	verificationCode: string;
	verificationCodeExpiresAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	verificationCode: {
		type: String,
		default: "",
	},
	verificationCodeExpiresAt: {
		type: Date,
		required: true,
	},
});

userSchema.methods.toJSON = function () {
	const { password, verificationCode, verificationCodeExpiresAt, ...userObject } = this.toObject();
	return userObject;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (!user.isModified("password")) {
		return next();
	}

	try {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		user.password = hashedPassword;
		next();
	} catch (error) {
		console.log("Error hashing password:", error);
		next(error as Error);
	}
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
