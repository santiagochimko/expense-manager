import { Router } from "express";
import { login, register } from "../../../controllers/auth.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import { authLimiter } from "../../../middlewares/rateLimiter.middleware.js";
import { loginSchema, registerSchema } from "../../../validations/auth.validation.js";

const router = Router();

//Registro
router.post("/register", authLimiter, validate(registerSchema), register);

//Login
router.post("/login", authLimiter, validate(loginSchema), login);

export default router;