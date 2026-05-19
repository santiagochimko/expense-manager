import {
    getDashboardSummary,
    getDashboardCharts
} from "../services/dashboard.service.js";

export const summary = async (req, res, next) => {
    try {
        const data = await getDashboardSummary(req.user.id);

        res.status(200).json({
            messsage: "Resumen del dashboard obtenido correctamente",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const charts = async (req, res, next) => {
    try {
        const data = await getDashboardCharts(req.user.id);

        res.status(200).json({
            messsage: "Datos de gráficos obtenidos correctamente",
            data
        });
    } catch (error) {
        next(error);
    }
};
