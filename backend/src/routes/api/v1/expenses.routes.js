import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import validate from "../../../middlewares/validate.middleware.js";
import {
    createExpenseSchema,
    updateExpenseSchema
} from "../../../validations/expense.validation.js";
import {
    create,
    getAll,
    getById,
    update,
    remove
} from "../../../controllers/expenses.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createExpenseSchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", validate(updateExpenseSchema), update);
router.delete("/:id", remove);

export default router;