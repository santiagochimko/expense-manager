import User from '../models/User.js';
import Expense from '../models/Expense.js';
import createError from '../utils/createError.js';
import { getPagination } from '../utils/pagination.js';
import {
    getCache,
    setCache,
    deleteCache,
    deleteCacheByPattern,
    CACHE_TTL
} from "../utils/cache.js";
import {
    convertAmountToUYU,
    normalizeExpenseCurrency
} from "../utils/currency.js";

const getExpenseSort = (queryParams) => {
    const sortBy = ["date", "amount"].includes(queryParams.sortBy)
        ? queryParams.sortBy
        : "date";
    const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;

    if (sortBy === "amount") {
        return { amountUYU: sortOrder, amount: sortOrder, date: -1 };
    }

    return { date: sortOrder, createdAt: sortOrder };
};

const shouldRecalculateAmountUYU = (data) => {
    return (
        Object.prototype.hasOwnProperty.call(data, "amount") ||
        Object.prototype.hasOwnProperty.call(data, "currency") ||
        Object.prototype.hasOwnProperty.call(data, "date")
    );
};

export const createExpense = async (data, userId) => {
    // Obtener usuario
    const user = await User.findById(userId);

    if (!user) {
        throw createError("Usuario no encontrado", 404);
    }

    //Validar limite si es Plus
    if (user.plan === "plus") {
        const count = await Expense.countDocuments({
            user: userId,
            isActive: true
        });
        if (count >= 4) {
            throw createError("Has alcanzado el límite de 4 gastos para el plan Plus. Actualiza a Premium para tener gastos ilimitados.", 403);
        }
    }

    const currencyData = await convertAmountToUYU({
        amount: data.amount,
        currency: data.currency || "UYU",
        date: data.date
    });

    //Crear gasto
    const expense = await Expense.create({
        ...data,
        ...currencyData,
        user: userId
    });

    await deleteCacheByPattern(`expenses:user:${userId}*`);
    await deleteCache(`dashboard:summary:${userId}`);
    await deleteCache(`dashboard:charts:${userId}`);

    return expense;
};

export const getExpensesByUser = async (userId, queryParams) => {

    const { page, limit, skip } = getPagination(queryParams.page, queryParams.limit);

    const search = queryParams.search || "";
    const category = queryParams.category || "";
    const sortBy = ["date", "amount"].includes(queryParams.sortBy) ? queryParams.sortBy : "date";
    const sortOrder = queryParams.sortOrder === "asc" ? "asc" : "desc";

    const cacheKey = `expenses:user:${userId}:page:${page}:limit:${limit}:search:${search}:category:${category}:sortBy:${sortBy}:sortOrder:${sortOrder}`;

    const cachedExpenses = await getCache(cacheKey);
    if (cachedExpenses) {
        return cachedExpenses;
    }

    //Filtro base: solo gastos del usuario y activos
    const filters = {
        user: userId,
        isActive: true
    };

    //Filtro por categoría
    if (queryParams.category) {
        filters.category = queryParams.category;
    }

    //Filtro por texto en title, usando regex case insensitive
    if (queryParams.search) {
        filters.title = { $regex: queryParams.search, $options: 'i' };
    }

    const expenses = await Expense.find(filters)
        .skip(skip)
        .limit(limit)
        .sort(getExpenseSort({ sortBy, sortOrder }))
        .populate("category", "name color");

    const total = await Expense.countDocuments(filters);

    const result = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: expenses
    };

    await setCache(cacheKey, result, CACHE_TTL.EXPENSES);

    return result;
};

export const getExpensesById = async (expenseId, userId) => {
    const cacheKey = `expenses:user:${userId}:id:${expenseId}`;

    const cachedExpense = await getCache(cacheKey);
    if (cachedExpense) {
        return cachedExpense;
    }

    const expense = await Expense.findOne({
        _id: expenseId,
        user: userId,
        isActive: true
    }).populate("category", "name color");

    if (!expense) {
        throw createError("Gasto no encontrado", 404);
    }

    await setCache(cacheKey, expense, CACHE_TTL.EXPENSES);

    return expense;
};

export const updateExpense = async (expenseId, userId, data) => {
    const currentExpense = await Expense.findOne({
        _id: expenseId,
        user: userId,
        isActive: true
    });

    if (!currentExpense) {
        throw createError("Gasto no encontrado", 404);
    }

    const nextData = { ...data };

    if (Object.prototype.hasOwnProperty.call(nextData, "currency")) {
        nextData.currency = normalizeExpenseCurrency(nextData.currency);
    }

    if (shouldRecalculateAmountUYU(nextData)) {
        const currencyData = await convertAmountToUYU({
            amount: Object.prototype.hasOwnProperty.call(nextData, "amount")
                ? nextData.amount
                : currentExpense.amount,
            currency: Object.prototype.hasOwnProperty.call(nextData, "currency")
                ? nextData.currency
                : currentExpense.currency || "UYU",
            date: Object.prototype.hasOwnProperty.call(nextData, "date")
                ? nextData.date
                : currentExpense.date
        });

        Object.assign(nextData, currencyData);
    }

    const expense = await Expense.findOneAndUpdate(
        {
            _id: expenseId,
            user: userId,
            isActive: true
        },
        nextData,
        {
            new: true,
            runValidators: true
        }
    ).populate("category", "name color");

    if (!expense) {
        throw createError("Gasto no encontrado", 404);
    }

    await deleteCacheByPattern(`expenses:user:${userId}*`);
    await deleteCache(`dashboard:summary:${userId}`);
    await deleteCache(`dashboard:charts:${userId}`);

    return expense;
};

export const deleteExpense = async (expenseId, userId) => {
    const expense = await Expense.findOneAndUpdate(
        {
            _id: expenseId,
            user: userId,
            isActive: true
        },
        { isActive: false },
        { new: true }
    );

    if (!expense) {
        throw createError("Gasto no encontrado", 404);
    }

    await deleteCacheByPattern(`expenses:user:${userId}*`);
    await deleteCache(`dashboard:summary:${userId}`);
    await deleteCache(`dashboard:charts:${userId}`);

    return expense;
};