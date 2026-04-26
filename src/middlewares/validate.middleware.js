//Middleware generico para validar el body, query o params con Joi.
//Se pasa el schema y opcionalmente que parte del request a validar.

const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: error.details.map((detail) => ({
                    field: detail.path.join("."),
                    message: detail.message
                }))
            });
        }

        //Se guarda el valor validado y limpio en req
        if (property === "query") {
            req.validatedQuery = value;
        } else {
            req[property] = value;
        }
        next();
    };
};

export default validate;