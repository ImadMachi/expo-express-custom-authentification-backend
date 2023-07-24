import express from "express";
import {
	registerUser,
	loginUser,
	verifyUser,
	resetPassword,
	getCurrentUser,
	sendVerificationCode,
} from "../controllers/userController";
import auth from "../middlewares/authenticate";
import validate from "../middlewares/validate";
import {
	loginUserValidation,
	registerUserValidation,
	resetPasswordValidation,
	sendVerificationCodeValidation,
	verifyUserValidation,
} from "../validationSchemas/userSchemas";

const router = express.Router();

router.post("/register", validate(registerUserValidation), registerUser);
router.post("/login", validate(loginUserValidation), loginUser);
router.post("/verify", validate(verifyUserValidation), verifyUser);
router.post("/send-verifcaton-code", validate(sendVerificationCodeValidation), sendVerificationCode);
router.post("/reset-password", validate(resetPasswordValidation), auth, resetPassword);
router.get("/get-current-user", auth, getCurrentUser);

export default router;
