import Joi from "joi";

export const registerUserValidation = Joi.object({
	lastName: Joi.string().min(2).required(),
	firstName: Joi.string().min(2).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

export const loginUserValidation = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const verifyUserValidation = Joi.object({
	email: Joi.string().email().required(),
	verificationCode: Joi.string().required(),
});

export const sendVerificationCodeValidation = Joi.object({
	email: Joi.string().email().required(),
});

export const resetPasswordValidation = Joi.object({
	newPassword: Joi.string().min(8).required(),
});

export const getCurrentUserValidation = Joi.object({
	userId: Joi.string().required(),
});
