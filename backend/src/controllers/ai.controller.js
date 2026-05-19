import { suggestCategory } from "../services/ai.service.js";

export const suggest = async (req, res, next) => {
    try {
        console.log("LLEGÓ AL CONTROLLER AI");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);
        const data = await suggestCategory(req.user.id, req.body);

        res.status(200).json({
            message: "Sugerencia de categoría obtenida correctamente",
            data
        });
    } catch (error) {
        next(error);
    }
};