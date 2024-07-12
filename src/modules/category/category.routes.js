import { Router } from "express";

import * as auth from "../../middleware/auth.middleware.js";
import * as categoryController from "./category.controller.js";
import * as categoryValidation from "./category.validation.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { endPointRoles } from "./category.endPoint.js";



const router = Router();

/* ==================== End Point Routers ==================== */
router.route('/')

    /* ==================== Get All Category Routers ==================== */
    .get(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        categoryController.getCategoriesController
    )

    /* ==================== Create Category Routers ==================== */
    .post(
        auth.authentication,
        auth.authorization(endPointRoles.USER_AND_ADMIN),
        validationMiddleware(categoryValidation.createCategoryVal),
        categoryController.createCategoryController
    )

router.route('/:id')

    /* ==================== Get Category By Id Routers ==================== */
    .get(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(categoryValidation.ParamsIdVal),
        categoryController.getCategoryByIdController
    )

    /* ==================== Update Category Routers ==================== */
    .put(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(categoryValidation.updateCategoryVal),
        categoryController.updateCategoryController
    )

    /* ==================== Delete Category Routers ==================== */
    .delete(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(categoryValidation.ParamsIdVal),
        categoryController.deleteCategoryController
    )

/* ==================== Get All Category Specific User Routers ==================== */
router.get('/allCategory/specificUsers',
    auth.authentication,
    auth.authorization(endPointRoles.USER_ROLE),
    categoryController.getAllCategorySpecificUserController
)


export default router;