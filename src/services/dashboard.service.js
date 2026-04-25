import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";

export const getDashboardSummary = async (userId) => {
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
        return acc + expense.amount;
    }, 0);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        );
    });

    const currentMonthAmount = currentMonthExpenses.reduce((acc, expense) => {
        return acc + expense.amount;
    }, 0);

    let usage = null;
    let remaining = null;

    if (user.role === "user" && user.plan === "plus") {
        usage = (totalExpenses / 4) * 100;
        remaining = Math.max(0, 4 - totalExpenses);
    }

    return {
        plan: user.plan,
        totalExpenses,
        totalAmount,
        currentMonthAmount,
        usage,
        remaining
    };
};

export const getDashboardCharts = async (userId) => {
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
                totalAmount: { $sum: "$amount" },
                totalCount: { $sum: 1 }
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
                totalAmount: { $sum: "$amount" },
                totalCount: { $sum: 1 }
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
                totalAmount: { $sum: "$amount" },
                totalCount: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    return {
        expensesByCategory,
        expensesByPaymentMethod,
        expensesByMonth
    };
};
