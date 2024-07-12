import { Router } from "express";

import * as userValidation from './user.validation.js'
import * as userController from './user.controller.js'
import { endPointRoles } from "./user.endPoint.js";

import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";

const router = Router();


router.route('/')
    /* ==================== Get All Users Routers ==================== */
    .get(
        userController.allUsersController
    )

    /* ==================== Change User Password Routers ==================== */
    .put(
        authentication,
        authorization(endPointRoles.USER_ROLE),
        validationMiddleware(userValidation.changeUserPasswordVal),
        userController.changeUserPasswordController
    )

    /* ==================== Logout User Routers ==================== */
    .patch(
        authentication,
        authorization(endPointRoles.USER_ROLE),
        userController.logOutController
    )

    /* ==================== Forget Password Routers ==================== */
    .post(
        authentication,
        authorization(endPointRoles.USER_AND_ADMIN),
        validationMiddleware(userValidation.forgetPasswordVal),
        userController.forgetPasswordController
    )

router.route('/:id')
    /* ==================== Get One User Routers ==================== */
    .get(
        authentication,
        validationMiddleware(userValidation.ParamsIdVal),
        userController.oneUsersController
    )

    /* ==================== Update User Profile Routers ==================== */
    .put(
        authentication,
        authorization(endPointRoles.USER_AND_ADMIN),
        validationMiddleware(userValidation.updateUserProfileVal),
        userController.updateUserProfileController
    )

    /* ==================== Delete User Account Routers ==================== */
    .patch(
        authentication,
        authorization(endPointRoles.ADMIN_ROLE),
        validationMiddleware(userValidation.ParamsIdVal),
        userController.deleteUserByAdminController
    )


/* ==================== Reset Password Routers ==================== */
router.post('/resetPassword/:token',
    authentication,
    authorization(endPointRoles.USER_AND_ADMIN),
    validationMiddleware(userValidation.resetPasswordVal),
    userController.resetPasswordController
)

export default router