import Joi from "joi";

export const getAdminUsersSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    role: Joi.string().valid("user", "admin").optional(),
    plan: Joi.string().valid("plus", "premium").optional(),
    search: Joi.string().trim().min(1).max(100).optional()
}).unknown(false);

export const getAdminExpensesSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    userId: Joi.string().hex().length(24).optional(),
    category: Joi.string().hex().length(24).optional(),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().min(1).max(100).optional()
}).unknown(false);