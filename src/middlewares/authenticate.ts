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

	jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
		if (err || !user) {
			return res.sendStatus(403);
		}

		req.user = user as IUser;
		next();
	});
};

export default auth;
