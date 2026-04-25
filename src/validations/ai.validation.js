import Joi from "joi";

export const suggestCategorySchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().allow("").optional(),
    amount: Joi.number().positive().optional()
}).required();