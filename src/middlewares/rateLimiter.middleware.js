import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 20, // máximo 20 requests por IP
    standardHeaders: true,//envia datos en el header (ver en postman )
    legacyHeaders: false,//desactiva headers viejos
    message: {
        error: "Too many requests, try again later."
    }
});

export const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many AI requests, try again later."
    }
});

export const exchangeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many exchange rate requests, try again later."
    }
});