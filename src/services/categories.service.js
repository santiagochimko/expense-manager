import Category from "../models/Category.js";
import createError from "../utils/createError.js";
import {
    getCache,
    setCache,
    deleteCache,
    deleteCacheByPattern,
    CACHE_TTL
} from "../utils/cache.js";

export const createCategory = async (data, userId) => {
    const category = await Category.create({
        ...data,
        user: userId
    });

    await deleteCache(`categories:user:${userId}`);

    return category;
}

export const getCategoriesByUser = async (userId) => {
    const cacheKey = `categories:user:${userId}`;

    const cachedCategories = await getCache(cacheKey);
    if (cachedCategories) {
        return cachedCategories;
    }

    const categories = await Category.find({
        user: userId,
        isActive: true
    }).sort({ createdAt: -1 });

    await setCache(cacheKey, categories, CACHE_TTL.CATEGORIES);

    return categories;
};

export const getCategoryById = async (categoryId, userId) => {
    const cacheKey = `categories:user:${userId}:id:${categoryId}`;

    const cachedCategory = await getCache(cacheKey);
    if (cachedCategory) {
        return cachedCategory;
    }

    const category = await Category.findOne({
        _id: categoryId,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw createError("Categoría no encontrada", 404);
    }

    await setCache(cacheKey, category, CACHE_TTL.CATEGORIES);

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

    await deleteCache(`categories:user:${userId}`);
    await deleteCache(`categories:user:${userId}:id:${categoryId}`);
    await deleteCacheByPattern(`expenses:user:${userId}*`);
    // await deleteCache(`dashboard:summary:${userId}`);
    // await deleteCache(`dashboard:charts:${userId}`);

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

    await deleteCache(`categories:user:${userId}`);
    await deleteCache(`categories:user:${userId}:id:${categoryId}`);
    await deleteCacheByPattern(`expenses:user:${userId}*`);
    // await deleteCache(`dashboard:summary:${userId}`);
    // await deleteCache(`dashboard:charts:${userId}`);

    return category;
}