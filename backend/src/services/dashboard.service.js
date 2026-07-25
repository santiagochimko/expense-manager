import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";
import { getCache, setCache, CACHE_TTL } from "../utils/cache.js";
import { getExpenseAmountUYU } from "../utils/currency.js";

const getAmountUYUExpression = () => {
    return { $ifNull: ["$amountUYU", "$amount"] };
};

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

    const totalAmount = expenses.reduce((acc, expense) => {
        return acc + getExpenseAmountUYU(expense);
    }, 0);

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

    let usage = null;
    let remaining = null;

    if (user.role === "user" && user.plan === "plus") {
        usage = (totalExpenses / 4) * 100;
        remaining = Math.max(0, 4 - totalExpenses);
    }

    const result = {
        plan: user.plan,
        totalExpenses,
        totalAmount: Number(totalAmount.toFixed(2)),
        currentMonthAmount: Number(currentMonthAmount.toFixed(2)),
        usage,
        remaining,
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

    const result = {
        baseCurrency: "UYU",
        expensesByCategory,
        expensesByPaymentMethod,
        expensesByMonth
    };

    await setCache(cacheKey, result, CACHE_TTL.DASHBOARD);

    return result;
};