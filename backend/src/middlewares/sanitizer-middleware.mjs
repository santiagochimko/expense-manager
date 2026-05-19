import xss from "xss";

const sanitizeValue = (value) => {
    if (typeof value === "string") {
        return xss(value);
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
    }

    if (value && typeof value === "object") {
        const sanitizedObject = {};

        for (const key in value) {
            sanitizedObject[key] = sanitizeValue(value[key]);
        }

        return sanitizedObject;
    }

    return value;
};

const xssSanitizer = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeValue(req.body);
    }

    if (req.params) {
        req.params = sanitizeValue(req.params);
    }

    if (req.query) {
        req.sanitizedQuery = sanitizeValue(req.query);
    }

    next();
};

export default xssSanitizer;