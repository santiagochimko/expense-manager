import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import {
    summary,
    charts,
    categoryReport
} from "../../../controllers/dashboard.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/summary", summary);
router.get("/charts", charts);
router.get("/category-report", categoryReport);

export default router;
