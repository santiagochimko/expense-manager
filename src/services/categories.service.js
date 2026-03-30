import Category from "../models/Category.js";
import createError from "../utils/createError.js";

export const createCategory = async (data, userId) => {
    const category = await Category.create({
        ...data,
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
        _id: categoryId,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw createError("Categoría no encontrada", 404);
    }

    return category;
};

export const updateCategory = async (categoryId, userId, data) => {
    const category = await Category.findOneAndUpdate(
        {
            _id: categoryId,
            user: userId,
            isActive: true
        },
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!category) {
        throw createError("Categoría no encontrada", 404);
    }

    return category;
}

export const deleteCategory = async (categoryId, userId) => {
    const category = await Category.findOneAndUpdate(
        {
            _id: categoryId,
            user: userId,
            isActive: true
        },
        { isActive: false },
        { new: true }
    );

    if (!category) {
        throw createError("Categoría no encontrada", 404);
    }

    return category;
}