import Joi from "joi"


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

/* ==================== Update User Profile validation ==================== */
const updateUserProfileVal = {
    params: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'any.required': 'ID is required.',
                'string.pattern.base': 'Invalid ObjectID. ObjectID must be a 24-character hexadecimal string.',
                'string.empty': 'ID is required.'
            })
    }).required(),

    body: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        email: Joi.string().email().optional(),
        
    }).required()
}

/* ==================== Change User Password validation ==================== */
const changeUserPasswordVal = {
    body: Joi.object({
        oldPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).optional(),
        newPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).optional(),
    }).required()
}


/* ==================== Forget Password Validation ==================== */
const forgetPasswordVal = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address.',
            'string.empty': 'Email is required.',
            'any.required': 'Email is required.'
        })
    }).required()
}

/* ==================== Reset Password Validation ==================== */
const resetPasswordVal = {
    params: Joi.object({
        token: Joi.string().required().messages({
            'string.empty': 'Token is required.',
            'any.required': 'Token is required.'
        })
    }).required(),

    body: Joi.object({
        newPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required().messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        })
    }).required()
}





export {
    ParamsIdVal,
    updateUserProfileVal,
    changeUserPasswordVal,
    forgetPasswordVal,
    resetPasswordVal,
}
