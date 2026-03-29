import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        //Valido existencia del header Authorization
        if (!authHeader) {
            return res.status(401).json({
                message: 'Token no proporcionado'
            });
        }

        //Espero un formato "Bearer token"
        const token = authHeader.replace("Bearer", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guardo usuario decodificado para usarlo en rutas protegidas
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido'
        });
    }
};

export default authMiddleware;