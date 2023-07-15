import express from "express";
import { registerUser, loginUser, verifyUser, forgotPassword, resetPassword } from "../controllers/userController";
import auth from "../middlewares/authenticate";
import validate from "../middlewares/validate";
import {
	forgotPasswordValidation,
	loginUserValidation,
	registerUserValidation,
	resetPasswordValidation,
	verifyUserValidation,
} from "../validationSchemas/userSchemas";

const router = express.Router();

router.post("/register", validate(registerUserValidation), registerUser);
router.post("/login", validate(loginUserValidation), loginUser);
router.post("/verify", validate(verifyUserValidation), verifyUser);
router.post("/forgot-password", validate(forgotPasswordValidation), forgotPassword);
router.post("/reset-password", validate(resetPasswordValidation), auth, resetPassword);

export default router;
