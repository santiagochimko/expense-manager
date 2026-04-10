import client from "../config/redis.js";

//TTL en seg
export const CACHE_TTL = {
    USER: 60,
    CATEGORIES: 60,
    EXPENSES: 60,
    // DASHBOARD: 60,
    // EXCHANGE: 300
};

//Obtiene un valor cache y lo parsea
export const getCache = async (key) => {
    const cachedData = await client.get(key);

    if(!cachedData) {
        return null;
    }

    return JSON.parse(cachedData);
};

//Guarda un valor serializado con expiracion
export const setCache = async (key, value, ttl = 60) => {
    await client.setEx(key, ttl, JSON.stringify(value));
};

//Elimina una key exacta
export const deleteCache = async (key) => {
    await client.del(key);
};

//Elimina varias keys por patron
export const deleteCacheByPattern = async (pattern) => {
    const keys = await client.keys(pattern);

    if(keys.length > 0) {
        await client.del(keys);
    }
};