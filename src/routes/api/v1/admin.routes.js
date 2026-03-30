import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import roleMiddleware from "../../../middlewares/role.middleware.js";
import { adminDashboard } from "../../../controllers/admin.controller.js";

const router = Router();

//Valido token
router.use(authMiddleware);

//Restinjo solo admin
router.use(roleMiddleware("admin"));

//Dashboard admin
router.get("/dashboard", adminDashboard);

export default router;