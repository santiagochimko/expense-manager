import { getCurrentUser, updateUserPlan } from "../services/users.service.js";

export const getMe = async (req, res, next) => {
    try {
       /*  //req.user viene del JWT
        res.status(200).json({
            message: "Usuario autenticado",
            data: req.user
        }); */

        //Para ver los cambios en tiempo real y no depender de que se actualice el token cada vez que se haga un cambio en el usuario, se hace una consulta a la base de datos para obtener la información actualizada del usuario
        const user = await getCurrentUser(req.user.id);

        res.status(200).json({
            message: "Usuario autenticado",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                plan: user.plan,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        next(error);
    }
};

export const updatePlan = async (req, res, next) => {
    try {
        const user = await updateUserPlan(req.user.id, req.body.plan);

        res.status(200).json({
            message: "Plan actualizado correctamente",
            data: {
                id: user._id,
                plan: user.plan
            }
        });
    } catch (error) {
        next(error);
    }
};