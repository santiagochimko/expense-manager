import { registerUser, loginUser } from '../services/auth.service.js';
import { userResponseDTO } from "../utils/dto.js"

export const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            message: "Usuario registrado correctamente",
            data: userResponseDTO(user)
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const {user, token} = await loginUser(req.body);

        res.status(200).json({
            message: "Login exitoso",
            data: {
                user: userResponseDTO(user),
                token
            }
        });
    } catch (error) {
        next(error);
    }
};