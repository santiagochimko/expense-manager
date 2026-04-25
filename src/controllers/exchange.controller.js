import { getExchangeRates } from "../services/exchange.service.js";

export const getRates = async (req, res, next) => {
    try {
        const base = req.query.base || "USD";

        const data = await getExchangeRates(base);

        res.status(200).json({
            message: "Tipo de cambio obtenido correctamente",
            data
        });
    } catch (error) {
        next(error);
    }
};