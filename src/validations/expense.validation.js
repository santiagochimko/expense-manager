import Joi from 'joi';

export const createExpenseSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().allow("").optional(),
    amount: Joi.number().positive().required(),
    date: Joi.date().required(),
    paymentMethod: Joi.string()
        .valid("cash", "debit_card", "credit_card", "transfer")
        .optional(),
    receiptImageUrl: Joi.string().uri().optional(),
    category: Joi.string().required(),
});

export const updateExpenseSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).optional(),
    description: Joi.string().trim().allow("").optional(),
    amount: Joi.number().positive().optional(),
    date: Joi.date().optional(),
    paymentMethod: Joi.string()
        .valid("cash", "debit_card", "credit_card", "transfer")
        .optional(),
    receiptImageUrl: Joi.string().uri().optional(),
    category: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
});