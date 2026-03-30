import Expense from '../models/Expense.js';
import createError from '../utils/createError.js';
import { getPagination } from '../utils/pagination.js';

export const createExpense = async (data, userId) => {
    //TODO: validar limite plan plus

    const expense = await Expense.create({
        ...data,
        user: userId
    });

    return expense;
};

export const getExpenseByUser = async (userId, queryParams) => {

    const { page, limit, skip } = getPagination(queryParams.page, queryParams.limit);

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
        .sort({ date: -1 }) // Ordenar por fecha descendente
        .populate("category", "name color");

    const total = await Expense.countDocuments(filters);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: expenses
    };
};

export const getExpenseById = async (expenseId, userId) => {
    const expense = await Expense.findOne({
        _id: expenseId,
        user: userId,
        isActive: true
    }).populate("category", "name color");

    if (!expense) {
        throw createError("Gasto no encontrado", 404);
    }

    return expense;
};

export const updateExpense = async (expenseId, userId, data) => {
    const expense = await Expense.findOneAndUpdate(
        {
            _id: expenseId,
            user: userId,
            isActive: true
        },
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate("category", "name color");

    if (!expense) {
        throw createError("Gasto no encontrado", 404);
    }

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

    return expense;
};