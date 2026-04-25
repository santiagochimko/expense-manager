import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoriesRoutes from "./categories.routes.js";
import expensesRoutes from "./expenses.routes.js";
import usersRoutes  from "./users.routes.js";
import adminRoutes  from "./admin.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import exchangeRoutes from "./exchange.routes.js";

const router = Router();

//Ruta de prueba
router.get("/", (req, res) => {
    res.status(200).json({
        message: "API v1 funcionando correctamente"
    });
});

router.use("/auth", authRoutes);
router.use("/categories", categoriesRoutes);
router.use("/expenses", expensesRoutes);
router.use("/users", usersRoutes);
router.use("/admin", adminRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/exchange-rates", exchangeRoutes);

export default router;