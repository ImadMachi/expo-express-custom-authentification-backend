// routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

export default router;
