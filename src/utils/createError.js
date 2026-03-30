//Helper para crear errores custom con statusCode
//Esto permite lanzar errores desde services y responderlos en el middleware global

const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export default createError;