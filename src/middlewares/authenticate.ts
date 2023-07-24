import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import createHttpError from "http-errors";
import httpStatus from "../utils/httpStatus";

const auth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		throw createHttpError(httpStatus.UNAUTHORIZED, "Access denied. No token provided");
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
		const user = data as IUser;
		if (err || !user) {
			return res.status(401).json(createHttpError(httpStatus.UNAUTHORIZED, "Invalid token"));
		}

		if (!user.isVerified) {
			return res.status(403).json(createHttpError(httpStatus.FORBIDDEN, "User is not verified"));
		}

		req.user = user;
		next();
	});
};

export default auth;
