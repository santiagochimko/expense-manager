import {
    createExpense,
    getExpenseByUser,
    getExpenseById,
    updateExpense,
    deleteExpense
} from '../services/expenses.service.js';

export const create = async (req, res, next) => {
    try {
        const expense = await createExpense(req.body, req.user.id);

        res.status(201).json({
            message: "Gasto creado correctamente",
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const result = await getExpenseByUser(req.user.id, req.query);

        res.status(200).json({
            message: "Gastos obtenidos correctamente",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const expense = await getExpenseById(req.params.id, req.user.id);

        res.status(200).json({
            message: "Gasto obtenido correctamente",
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const expense = await updateExpense(req.params.id, req.user.id, req.body);

        res.status(200).json({
            message: "Gasto actualizado correctamente",
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const expense = await deleteExpense(req.params.id, req.user.id);

        res.status(200).json({
            message: "Gasto eliminado correctamente",
            data: expense
        });
    } catch (error) {
        next(error);
    }
};