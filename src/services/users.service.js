import User from "../models/User.js";
import createError from "../utils/createError.js";

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw createError("Usuario no encontrado", 404);
    }

    return user;
};

export const updateUserPlan = async (userId, newPlan) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new createError("Usuario no encontrado", 404);
    }

    if (user.role === "admin") {
        throw new createError("El admin no tiene plan", 400);
    }

    if (user.plan === newPlan) {
        throw new createError("El usuario ya tiene ese plan", 400);
    }

    user.plan = newPlan;
    await user.save();
    return user;
};