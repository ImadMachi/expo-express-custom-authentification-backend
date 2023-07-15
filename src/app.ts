import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import runDatabase from "./config/database";
import userRoutes from "./routes/userRoutes";
import ErrorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

runDatabase().catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

// app.get("/test", (req, res, next) => {
// 	try {
// 		if (true) {
// 			throw createHttpError(405, "Test error");
// 		}
// 	} catch (e) {
// 		next(e);
// 	}
// });

app.use("/api/users", userRoutes);

app.use(ErrorHandler);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
