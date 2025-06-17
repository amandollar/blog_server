


export const zodValidationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
         
            schema.parse(req.body);
            next(); 
        } catch (error) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
    };
};