import express from "express";
import dotenv from "dotenv";
import runDatabase from "./config/database";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

runDatabase().catch((err) => console.log(err));

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
