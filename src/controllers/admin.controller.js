import {
    getAdminDashboard,
    getAdminUsers,
    getAdminExpenses
} from '../services/admin.service.js';

export const adminDashboard = async (req, res, next) => {
    try {
        const data = await getAdminDashboard();

        res.status(200).json({
            message: "Dashboard admin obtenido correctamente",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const adminUsers = async (req, res, next) => {
    try {
        const result = await getAdminUsers(req.query);

        res.status(200).json({
            message: "Usuarios obtenidos correctamente",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const adminExpenses = async (req, res, next) => {
    try {
        const result = await getAdminExpenses(req.query);

        res.status(200).json({
            message: "Gastos obtenidos correctamente",
            ...result
        });
    } catch (error) {
        next(error);
    }
};