const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;

    res.status(status).json({
        message: err.message || "Error interno del servidor"
    });
};

export default errorHandler;