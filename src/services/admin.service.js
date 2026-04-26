import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import { getPagination } from "../utils/pagination.js";

export const getAdminDashboard = async () => {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    const totalPlusUsers = await User.countDocuments({
        role: "user",
        plan: "plus"
    });

    const totalPremiumUsers = await User.countDocuments({
        role: "user",
        plan: "premium"
    });

    const totalCategories = await Category.countDocuments({
        isActive: true
    });

    const activeExpenses = await Expense.countDocuments({
        isActive: true
    });

    const deletedExpenses = await Expense.countDocuments({
        isActive: false
    });

    const amountResult = await Expense.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);

    const totalAmount = amountResult.length > 0
        ? amountResult[0].totalAmount
        : 0;

    return {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        totalPlusUsers,
        totalPremiumUsers,
        totalCategories,
        activeExpenses,
        deletedExpenses,
        totalExpenses: activeExpenses + deletedExpenses,
        totalAmount
    };
};

export const getAdminUsers = async (queryParams) => {
    const { page, limit, skip } = getPagination(queryParams.page, queryParams.limit);

    const filters = {};

    if (queryParams.role) {
        filters.role = queryParams.role;
    }

    if (queryParams.plan) {
        filters.plan = queryParams.plan;
    }

    if (queryParams.search) {
        filters.$or = [
            { username: { $regex: queryParams.search, $options: "i" } },
            { email: { $regex: queryParams.search, $options: "i" } }
        ];
    }

    const users = await User.find(filters)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filters);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: users
    };
};

export const getAdminExpenses = async (queryParams) => {
    const { page, limit, skip } = getPagination(queryParams.page, queryParams.limit);

    const filters = {};

    if (queryParams.userId) {
        filters.user = queryParams.userId;
    }

    if (queryParams.category) {
        filters.category = queryParams.category;
    }

    if (queryParams.isActive !== undefined) {
        filters.isActive = queryParams.isActive === "true";
    }

    if (queryParams.search) {
        filters.title = { $regex: queryParams.search, $options: "i" };
    }

    const expenses = await Expense.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
        .populate("user", "username email role plan")
        .populate("category", "name color");

    const total = await Expense.countDocuments(filters);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: expenses
    };
}