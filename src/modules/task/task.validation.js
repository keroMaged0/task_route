import Joi from "joi"


/* ==================== Create Task validation ==================== */
const createTaskVal = {
    body: Joi.object({
        title: Joi.string().min(2).max(200).required(),
        categoryId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'any.required': 'ID is required.',
                'string.pattern.base': 'Invalid ObjectID. ObjectID must be a 24-character hexadecimal string.',
                'string.empty': 'ID is required.'
            }),
        body: Joi.string().optional(),
        items: Joi.array().items(
            Joi.object({
                text: Joi.string().required()
            })
        ).optional(),
        shared: Joi.string().required().valid('public', 'private'),
        type: Joi.string().required().valid('text', 'list')
    })
}

/* ==================== Update Task validation ==================== */
const updateTaskVal = {
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
        title: Joi.string().min(2).max(200),
        categoryId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'any.required': 'ID is required.',
                'string.pattern.base': 'Invalid ObjectID. ObjectID must be a 24-character hexadecimal string.',
                'string.empty': 'ID is required.'
            }),
        body: Joi.when('type', {
            is: 'text',
            then: Joi.string().required(),
            otherwise: Joi.forbidden()
        }).optional(),
        items: Joi.when('type', {
            is: 'list',
            then: Joi.array().items(
                Joi.object({
                    text: Joi.string().required()
                })
            ).required(),
            otherwise: Joi.forbidden()
        }).optional(),
        shared: Joi.string().valid('public', 'private'),
        type: Joi.string().valid('text', 'list')
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
    createTaskVal,
    ParamsIdVal,
    updateTaskVal
}