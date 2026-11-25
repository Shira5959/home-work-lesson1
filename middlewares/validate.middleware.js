const validate = (schema) => {
    return (req, res, next) => {
        const { value, error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const err = new Error(error.details.map((detail) => detail.message).join(', '));
            err.status = 400;
            return next(err);
        }
        req.body = value;
        next();
    };
};

module.exports = validate;