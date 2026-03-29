export const getMe = async (req, res, next) => {
    try {
        //req.user viene del JWT
        res.status(200).json({
            message: "Usuario autenticado",
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};