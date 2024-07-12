import { Router } from "express";

import * as auth from "../../middleware/auth.middleware.js";
import * as taskController from "./task.controller.js";
import * as taskValidation from "./task.validation.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { endPointRoles } from "./task.endPoint.js";


const router = Router();

/* ==================== End Point Routers ==================== */
router.route('/')

    /* ==================== Get All Tasks Routers ==================== */
    .get(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        taskController.getTasksPrivateController
    )

    /* ==================== Create Task Routers ==================== */
    .post(
        auth.authentication,
        auth.authorization(endPointRoles.USER_AND_ADMIN),
        validationMiddleware(taskValidation.createTaskVal),
        taskController.createTaskController
    )

/* ==================== Get All Task Public Routers ==================== */
router.get('/public',
    auth.authentication,
    auth.authorization(endPointRoles.USER_ROLE),
    taskController.getTasksPublicController
)

router.route('/:id')

    /* ==================== Get Task By Id Routers ==================== */
    .get(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(taskValidation.ParamsIdVal),
        taskController.getTaskByIDController
    )

    /* ==================== Update Task Routers ==================== */
    .put(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(taskValidation.updateTaskVal),
        taskController.updateTaskController
    )

    /* ==================== Delete Task Routers ==================== */
    .delete(
        auth.authentication,
        auth.authorization(endPointRoles.USER_ROLE),
        validationMiddleware(taskValidation.ParamsIdVal),
        taskController.deleteTaskController
    )


export default router;