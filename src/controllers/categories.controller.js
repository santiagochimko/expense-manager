import {
    createCategory,
    getCategoriesByUser,
    getCategoryById
} from "../services/categories.service.js";

export const create = async (req, res, next) => {
    try {
        const category = await createCategory(req.body, req.user.id);

        res.status(201).json({
            message: "Categoría creada correctamente",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const categories = await getCategoriesByUser(req.user.id);

        res.status(200).json({
            message: "Categorías obtenidas correctamente",
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id, req.user.id);

        res.status(200).json({
            message: "Categoría obtenida correctamente",
            data: category
        });
    } catch (error) {
        next(error);
    }
};