import { Router } from "express";
import { login, register } from "../../../controllers/auth.controller";
import { validate } from "../../../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../../../schemas/auth.schema.js";

const router = Router();

//Registro
router.post("/register", validate(registerSchema), register);

//Login
router.post("/login", validate(loginSchema), login);

export default router;