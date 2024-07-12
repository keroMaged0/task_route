import { Router } from "express";

import * as authController from './auth.controller.js';
import * as authValidations from './auth.validation.js';
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { uniqueEmail } from "../../middleware/unique_email.middleware.js";


const router = Router();


//=================================== SignUp router ===================================//
router.post('/SignUp',
    validationMiddleware(authValidations.SignUpValidations),
    uniqueEmail,
    authController.SignUpController
)

//=================================== SignIn router ===================================//
router.post('/SignIn',
    validationMiddleware(authValidations.SignInValidations),
    authController.SignInController
)

//=================================== verifyEmail router ===================================//
router.get('/verify/:token',
    authController.verifyEmailController
)

export default router;