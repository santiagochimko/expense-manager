import Category from "../models/Category.js";
import createError from "../utils/createError.js";

export const createCategory = async (DataTransfer, userId) => {
    const category = await Category.create({
        ...DataTransfer,
        user: userId
    })

    return category;
}

export const getCategoriesByUser = async (userId) => {

    return await Category.find({
        user: userId,
        isActive: true
    }).sort({ createdAt: -1 });
};

export const getCategoryById = async (categoryId, userId) => {
    const category = await Category.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw createError("Categoría no encontrada", 404);
    }

    return category;
};