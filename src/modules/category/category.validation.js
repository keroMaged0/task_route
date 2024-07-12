import Joi from "joi"


/* ==================== Create Category validation ==================== */
const createCategoryVal = {
    body: Joi.object({
        name: Joi.string().min(2).max(200)
    })
}

/* ==================== Update Category validation ==================== */
const updateCategoryVal = {
    params: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'any.required': 'ID is required.',
                'string.pattern.base': 'Invalid ObjectID. ObjectID must be a 24-character hexadecimal string.',
                'string.empty': 'ID is required.'
            })
    }),
    body: Joi.object({
        name: Joi.string().min(2).max(200).optional()
    })
}

/* ==================== Params id validation ==================== */
const ParamsIdVal = {
    params: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'any.required': 'ID is required.',
                'string.pattern.base': 'Invalid ObjectID. ObjectID must be a 24-character hexadecimal string.',
                'string.empty': 'ID is required.'
            })
    })
}

export {
    createCategoryVal,
    ParamsIdVal,
    updateCategoryVal
}