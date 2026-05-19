// const errorHandler = (err, req, res, next) => {
//     const status = err.statusCode || 500;

//     res.status(status).json({
//         message: err.message || "Error interno del servidor"
//     });
// };

// export default errorHandler;

const errorHandler = (err, req, res, next) => {
  // Error de Mongoose por validación del schema
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message
    });
  }

  // Error de cast de Mongo (por ejemplo id inválido)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "ID inválido"
    });
  }

  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Error interno del servidor"
  });
};

export default errorHandler;