import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid("user", "admin").required()
});

export const loginSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().required()
});