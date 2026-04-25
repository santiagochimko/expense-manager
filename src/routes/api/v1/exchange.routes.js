import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import { getRates } from "../../../controllers/exchange.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getRates);

export default router;