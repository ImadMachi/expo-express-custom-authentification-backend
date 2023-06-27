// routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser, verifyUser, forgotPassword, resetPassword } from "../controllers/userController";
import auth from "../middlewares/authentication";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", auth, resetPassword);

export default router;
