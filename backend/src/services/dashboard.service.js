import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";
import { getCache, setCache, CACHE_TTL } from "../utils/cache.js";
import { getExpenseAmountUYU } from "../utils/currency.js";

const getAmountUYUExpression = () => {
    return { $ifNull: ["$amountUYU", "$amount"] };
};

const getCurrentMonthKey = () => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

const normalizeMonthKey = (month) => {
    if (!month) {
        return getCurrentMonthKey();
    }

    const value = String(month).trim();

    if (!/^\d{4}-\d{2}$/.test(value)) {
        throw createError("Mes inválido. Usá el formato YYYY-MM", 400);
    }

    return value;
};

const getMonthRange = (monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    return { start, end };
};

const getPreviousMonthKey = (monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const previous = new Date(Date.UTC(year, month - 2, 1));
    const previousYear = previous.getUTCFullYear();
    const previousMonth = String(previous.getUTCMonth() + 1).padStart(2, "0");

    return `${previousYear}-${previousMonth}`;
};

const normalizeCategoryIds = (categories) => {
    if (!categories) {
        return [];
    }

    return String(categories)
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);
};

const getVariation = (currentValue, previousValue) => {
    const variationAmount = Number((currentValue - previousValue).toFixed(2));

    if (!previousValue) {
        return {
            variationAmount,
            variationPercent: currentValue > 0 ? 100 : 0
        };
    }

    return {
        variationAmount,
        variationPercent: Number(((variationAmount / previousValue) * 100).toFixed(2))
    };
};

const getExpenseCategoryId = (expense) => {
    return String(expense.category?._id || expense.category || "uncategorized");
};

const getExpenseCategoryName = (expense) => {
    return expense.category?.name || "Sin categoría";
};

const getExpenseCategoryColor = (expense) => {
    return expense.category?.color || "#94a3b8";
};

const toMoney = (value) => Number(Number(value || 0).toFixed(2));

export const getDashboardSummary = async (userId) => {
    const cacheKey = `dashboard:summary:${userId}`

    const cachedSummary = await getCache(cacheKey);
    if (cachedSummary) {
        return cachedSummary;
    }

    const user = await User.findById(userId);

    if (!user) {
        throw createError("Usuario no encontrado", 404);
    }

    const expenses = await Expense.find({
        user: userId,
        isActive: true
    });

    const totalExpenses = expenses.length;

    const today = new Date();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();

    const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
            expenseDate.getUTCMonth() === currentMonth &&
            expenseDate.getUTCFullYear() === currentYear
        );
    });

    const currentMonthAmount = currentMonthExpenses.reduce((acc, expense) => {
        return acc + getExpenseAmountUYU(expense);
    }, 0);

    const result = {
        totalExpenses,
        currentMonthAmount: toMoney(currentMonthAmount),
        currentMonthExpenses: currentMonthExpenses.length,
        baseCurrency: "UYU"
    };

    await setCache(cacheKey, result, CACHE_TTL.DASHBOARD);

    return result;
};

export const getDashboardCharts = async (userId) => {
    const cacheKey = `dashboard:charts:${userId}`;

    const cachedCharts = await getCache(cacheKey);
    if (cachedCharts) {
        return cachedCharts;
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const expensesByCategory = await Expense.aggregate([
        {
            $match: {
                user: objectUserId,
                isActive: true
            }
        },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: getAmountUYUExpression() },
                totalCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                categoryName: "$category.name",
                categoryColor: "$category.color",
                totalAmount: { $round: ["$totalAmount", 2] },
                totalCount: 1
            }
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);

    const expensesByCategoryByMonth = await Expense.aggregate([
        {
            $match: {
                user: objectUserId,
                isActive: true
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    category: "$category"
                },
                totalAmount: { $sum: getAmountUYUExpression() },
                totalCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id.category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                categoryId: "$_id.category",
                categoryName: "$category.name",
                categoryColor: "$category.color",
                totalAmount: { $round: ["$totalAmount", 2] },
                totalCount: 1
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1, totalAmount: -1 }
        }
    ]);

    const expensesByPaymentMethod = await Expense.aggregate([
        {
            $match: {
                user: objectUserId,
                isActive: true
            }
        },
        {
            $group: {
                _id: "$paymentMethod",
                totalAmount: { $sum: getAmountUYUExpression() },
                totalCount: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                totalAmount: { $round: ["$totalAmount", 2] },
                totalCount: 1
            }
        }
    ]);

    const expensesByMonth = await Expense.aggregate([
        {
            $match: {
                user: objectUserId,
                isActive: true
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalAmount: { $sum: getAmountUYUExpression() },
                totalCount: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                totalAmount: { $round: ["$totalAmount", 2] },
                totalCount: 1
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    const availableMonths = expensesByMonth.map((item) => {
        return `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    });

    const result = {
        baseCurrency: "UYU",
        availableMonths,
        expensesByCategory,
        expensesByCategoryByMonth,
        expensesByPaymentMethod,
        expensesByMonth
    };

    await setCache(cacheKey, result, CACHE_TTL.DASHBOARD);

    return result;
};

export const getDashboardCategoryReport = async (userId, queryParams = {}) => {
    const month = normalizeMonthKey(queryParams.month);
    const previousMonth = getPreviousMonthKey(month);
    const categoryIds = normalizeCategoryIds(queryParams.categories);
    const categoriesKey = categoryIds.length > 0 ? categoryIds.sort().join(",") : "all";
    const cacheKey = `dashboard:category-report:${userId}:month:${month}:categories:${categoriesKey}`;

    const cachedReport = await getCache(cacheKey);
    if (cachedReport) {
        return cachedReport;
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);
    const { start, end } = getMonthRange(month);
    const { start: previousStart, end: previousEnd } = getMonthRange(previousMonth);

    const baseFilters = {
        user: objectUserId,
        isActive: true
    };

    if (categoryIds.length > 0) {
        baseFilters.category = {
            $in: categoryIds.map((categoryId) => new mongoose.Types.ObjectId(categoryId))
        };
    }

    const currentExpenses = await Expense.find({
        ...baseFilters,
        date: { $gte: start, $lt: end }
    })
        .sort({ date: 1, createdAt: 1 })
        .populate("category", "name color");

    const previousExpenses = await Expense.find({
        ...baseFilters,
        date: { $gte: previousStart, $lt: previousEnd }
    }).populate("category", "name color");

    const categoryMap = new Map();

    const ensureCategory = (expense) => {
        const id = getExpenseCategoryId(expense);

        if (!categoryMap.has(id)) {
            categoryMap.set(id, {
                id,
                name: getExpenseCategoryName(expense),
                color: getExpenseCategoryColor(expense),
                totalAmount: 0,
                totalCount: 0,
                previousTotalAmount: 0,
                previousTotalCount: 0
            });
        }

        return categoryMap.get(id);
    };

    currentExpenses.forEach((expense) => {
        const category = ensureCategory(expense);
        category.totalAmount += getExpenseAmountUYU(expense);
        category.totalCount += 1;
    });

    previousExpenses.forEach((expense) => {
        const category = ensureCategory(expense);
        category.previousTotalAmount += getExpenseAmountUYU(expense);
        category.previousTotalCount += 1;
    });

    const categories = Array.from(categoryMap.values())
        .map((category) => {
            const totalAmount = toMoney(category.totalAmount);
            const previousTotalAmount = toMoney(category.previousTotalAmount);

            return {
                ...category,
                totalAmount,
                previousTotalAmount,
                ...getVariation(totalAmount, previousTotalAmount)
            };
        })
        .sort((a, b) => b.totalAmount - a.totalAmount);

    const totalAmount = toMoney(categories.reduce((acc, category) => acc + category.totalAmount, 0));
    const previousTotalAmount = toMoney(categories.reduce((acc, category) => acc + category.previousTotalAmount, 0));

    const result = {
        month,
        previousMonth,
        baseCurrency: "UYU",
        totalAmount,
        totalCount: currentExpenses.length,
        previousTotalAmount,
        previousTotalCount: previousExpenses.length,
        ...getVariation(totalAmount, previousTotalAmount),
        categories,
        expenses: currentExpenses.map((expense) => ({
            id: expense._id,
            date: expense.date,
            title: expense.title,
            description: expense.description || "",
            categoryId: getExpenseCategoryId(expense),
            categoryName: getExpenseCategoryName(expense),
            paymentMethod: expense.paymentMethod,
            amount: expense.amount,
            currency: expense.currency || "UYU",
            amountUYU: getExpenseAmountUYU(expense)
        }))
    };

    await setCache(cacheKey, result, CACHE_TTL.DASHBOARD);

    return result;
};