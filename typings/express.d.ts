import { HydratedDocument } from "mongoose";
import { IUser } from "../src/models/User";

declare global {
	namespace Express {
		interface Request {
			user?: HydratedDocument<IUser>;
		}
	}
}
