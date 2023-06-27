import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";

const auth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		req.user = user as HydratedDocument<IUser>;
		next();
	});
};

export default auth;
