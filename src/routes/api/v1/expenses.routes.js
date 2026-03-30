import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import validate from "../../../middlewares/validate.middleware.js";
import { createExpenseSchema } from "../../../validations/expense.validation.js";
import {
    create,
    getAll,
    getById
} from "../../../controllers/expenses.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createExpenseSchema), create);
router.get("/", getAll);
router.get("/:id", getById);

export default router;