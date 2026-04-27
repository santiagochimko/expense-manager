import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import { exchangeLimiter } from "../../../middlewares/rateLimiter.middleware.js";
import { getRates } from "../../../controllers/exchange.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", exchangeLimiter, getRates);

export default router;