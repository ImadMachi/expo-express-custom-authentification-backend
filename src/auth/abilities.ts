import { MongoAbility, defineAbility } from "@casl/ability";
import { IUser, UserRole } from "../models/User";

type Action = "manage" | "create" | "read" | "update" | "delete";
type Subject = IUser | "User" | "all";

export default (user: IUser) =>
	defineAbility<MongoAbility<[Action, Subject]>>((can, cannot) => {
		if (user.role === UserRole.ADMIN) {
			can("manage", "all");
		} else {
			can(["read", "update"], "User", { _id: user._id });
		}

		return { can, cannot };
	});
