import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    description: Joi.string().trim().allow("").optional(),
    color: Joi.string().trim().optional()
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).optional(),
    description: Joi.string().trim().allow("").optional(),
    color: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional()
});