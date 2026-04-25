import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import validate from "../../../middlewares/validate.middleware.js";
import { suggestCategorySchema } from "../../../validations/ai.validation.js";
import { suggest } from "../../../controllers/ai.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/suggest-category", validate(suggestCategorySchema), suggest);

export default router;