import createError from "./createError.js";
import { getCache, setCache, CACHE_TTL } from "./cache.js";

export const SUPPORTED_EXPENSE_CURRENCIES = ["UYU", "USD", "EUR"];

export const normalizeExpenseCurrency = (currency = "UYU") => {
    const normalizedCurrency = String(currency || "UYU").trim().toUpperCase();

    if (!SUPPORTED_EXPENSE_CURRENCIES.includes(normalizedCurrency)) {
        throw createError("Moneda de gasto inválida", 400);
    }

    return normalizedCurrency;
};

export const getCalendarDateKey = (date) => {
    if (!date) {
        return new Date().toISOString().slice(0, 10);
    }

    if (typeof date === "string") {
        return date.slice(0, 10);
    }

    return new Date(date).toISOString().slice(0, 10);
};

const fetchRateFromCurrencyApiVersion = async (currency, version) => {
    const currencyKey = currency.toLowerCase();
    const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${version}/v1/currencies/${currencyKey}.json`
    );

    if (!response.ok) {
        throw new Error("No se pudo obtener el tipo de cambio");
    }

    const data = await response.json();
    const rate = data?.[currencyKey]?.uyu;

    if (!rate || Number.isNaN(Number(rate))) {
        throw new Error("No se encontró cotización a UYU");
    }

    return Number(rate);
};

const fetchRateFromCurrencyApi = async (currency, dateKey) => {
    try {
        return await fetchRateFromCurrencyApiVersion(currency, dateKey);
    } catch (error) {
        return fetchRateFromCurrencyApiVersion(currency, "latest");
    }
};

export const getExchangeRateToUYU = async (currency = "UYU", date = new Date()) => {
    const normalizedCurrency = normalizeExpenseCurrency(currency);

    if (normalizedCurrency === "UYU") {
        return 1;
    }

    const dateKey = getCalendarDateKey(date);
    const cacheKey = `expense-currency-rate:${normalizedCurrency}:UYU:${dateKey}`;

    const cachedRate = await getCache(cacheKey);
    if (cachedRate) {
        return Number(cachedRate);
    }

    try {
        const rate = await fetchRateFromCurrencyApi(normalizedCurrency, dateKey);
        await setCache(cacheKey, rate, CACHE_TTL.EXCHANGE);
        return rate;
    } catch (error) {
        throw createError(
            `No se pudo obtener la cotización ${normalizedCurrency} a UYU para la fecha del gasto`,
            503
        );
    }
};

export const convertAmountToUYU = async ({ amount, currency = "UYU", date }) => {
    const normalizedCurrency = normalizeExpenseCurrency(currency);
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        throw createError("El monto debe ser mayor a 0", 400);
    }

    const exchangeRateToUYU = await getExchangeRateToUYU(normalizedCurrency, date);
    const amountUYU = Number((numericAmount * exchangeRateToUYU).toFixed(2));

    return {
        currency: normalizedCurrency,
        exchangeRateToUYU,
        amountUYU
    };
};

export const getExpenseAmountUYU = (expense) => {
    const amountUYU = Number(expense?.amountUYU);

    if (!Number.isNaN(amountUYU) && amountUYU > 0) {
        return amountUYU;
    }

    return Number(expense?.amount || 0);
};