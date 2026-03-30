export const adminDashboard = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Panel admin disponible"
        });
    } catch (error) {
        next(error);
    }
};