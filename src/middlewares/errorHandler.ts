import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const ErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
	const errStatus = err.status || 500;
	const errMsg = err.message || "Something went wrong";
	res.status(errStatus).json({
		name: err.name,
		message: errMsg,
		stack: process.env.NODE_ENV === "development" ? err.stack : {},
	});
};

export default ErrorHandler;
