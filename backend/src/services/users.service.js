import User from "../models/User.js";
import createError from "../utils/createError.js";
import { getCache, setCache, deleteCache, CACHE_TTL } from "../utils/cache.js";

export const getCurrentUser = async (userId) => {
    const cacheKey = `user:${userId}`;

    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
        return cachedUser;
    }

    const user = await User.findById(userId);

    if (!user) {
        throw createError("Usuario no encontrado", 404);
    }

    const safeUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    await setCache(cacheKey, safeUser, CACHE_TTL.USER);

    return safeUser;
};

export const updateUserPlan = async (userId, newPlan) => {
    const user = await User.findById(userId);

    if (!user) {
        throw createError("Usuario no encontrado", 404);
    }

    if (user.role === "admin") {
        throw createError("El admin no tiene plan", 400);
    }

    if (user.plan === newPlan) {
        throw createError("El usuario ya tiene ese plan", 400);
    }

    user.plan = newPlan;
    await user.save();

    //invalidar cache del usuario y dashboard
    await deleteCache(`user:${userId}`);
    await deleteCache(`dashboard:summary:${userId}`);
    await deleteCache(`dashboard:charts:${userId}`);

    return user;
};