import Joi from "joi";

export const updatePlanSchema = Joi.object({
    plan: Joi.string().valid("plus", "premium").required()
});