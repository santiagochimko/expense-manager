import { Router } from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import roleMiddleware from "../../../middlewares/role.middleware.js";
import {
    adminDashboard,
    adminUsers,
    adminExpenses
} from "../../../controllers/admin.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import {
    getAdminUsersSchema,
    getAdminExpensesSchema
} from "../../../validations/admin.validation.js";

const router = Router();

//Valido token
router.use(authMiddleware);

//Restinjo solo admin
router.use(roleMiddleware("admin"));

//Dashboard admin
router.get("/dashboard", adminDashboard);

// Listado global de usuarios
router.get("/users", validate(getAdminUsersSchema, "query"), adminUsers);

// Listado global de gastos
router.get("/expenses", validate(getAdminExpensesSchema, "query"), adminExpenses);

export default router;