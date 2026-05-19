import createError from "../utils/createError.js";
import { getCache, setCache, CACHE_TTL } from "../utils/cache.js";

export const getExchangeRates = async (base = "USD") => {
    const normalizedBase = base.toUpperCase().trim();

    if (!/^[A-Z]{3}$/.test(normalizedBase)) {
        throw createError("Moneda base inválida", 400);
    }

    const cacheKey = `exchange-rates:${normalizedBase}`;

    const cachedRates = await getCache(cacheKey);
    if (cachedRates) {
        return cachedRates;
    }

    try {
        const response = await fetch(
            `https://api.frankfurter.app/latest?from=${normalizedBase}`
        );

        if (!response.ok) {
            throw createError("No se pudo obtener el tipo de cambio", 503);
        }

        const data = await response.json();

        const result = {
            base: data.base,
            date: data.date,
            rates: data.rates
        };

        await setCache(cacheKey, result, CACHE_TTL.EXCHANGE);

        return result;
    } catch (error) {
        throw createError("No se pudo obtener el tipo de cambio", 503);
    }
}