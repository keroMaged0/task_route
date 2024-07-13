import categoryModel from "../../../DB/models/category.model.js"
import taskModel from "../../../DB/models/task.model.js"
import { catchError } from "../../middleware/global-response.middleware.js"
import { ApiFeature } from "../../service/api_feature.service.js";

/* ==================== Get All Tasks Private Controller ==================== */
const getTasksPrivateController = catchError(
    async (req, res) => {
        const { userId } = req.authUser;
        const { page, size, sort, ...query } = req.query

        const apiFeature = new ApiFeature(req.query, taskModel.find({ addBy: userId, shared: 'private' }))
            .pagination()
            .sorting(sort)

        const tasks = await apiFeature.mongooseQuery
            .populate([
                { path: 'addBy', select: 'name' },
                { path: 'categoryId', select: 'name' },
            ])


        res.status(200).json({ message: 'Successfully', data: tasks })
    }
)

/* ==================== Get All Tasks Public Controller ==================== */
const getTasksPublicController = catchError(
    async (req, res) => {
        const { page, size, sort, ...query } = req.query

        const apiFeature = new ApiFeature(req.query, taskModel.find({ shared: 'public' }))
            .pagination()
            .sorting(sort)

        const tasks = await apiFeature.mongooseQuery
            .populate([
                { path: 'addBy', select: 'name' },
                { path: 'categoryId', select: 'name' },
            ])


        res.status(200).json({ message: 'Successfully', data: tasks })
    }
)

/* ==================== Create Task Controller ==================== */
const createTaskController = catchError(
    async (req, res) => {
        const { title, categoryId, body, items, shared, type } = req.body
        const { userId } = req.authUser

        const uniqueTitle = await taskModel.findOne({ title: title, categoryId: categoryId })
        if (uniqueTitle) return res.status(400).json({ message: 'Task title already exists in this category' })

        if (type === 'text' && !body) {
            return res.status(400).json({ error: 'Text tasks must have a body' });
        }
        if (type === 'list' && (!items || !Array.isArray(items) || items.length === 0)) {
            return res.status(400).json({ error: 'List tasks must have items' });
        }

        const task = new taskModel({
            title: title,
            categoryId: categoryId,
            shared: shared,
            body: type === 'text' ? body : undefined,
            items: type === 'list' ? items : undefined,
            type: type,
            addBy: userId
        })

        await task.save()

        res.status(200).json({ message: 'Task Created Successfully', data: task })

    }
)

/* ==================== Get Task By Id Controller ==================== */
const getTaskByIDController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser

        const task = await taskModel.findOne({ _id: id, addBy: userId })
        if (!task) return res.status(404).json({ message: 'Task Not Found' })

        res.status(200).json({ message: 'Successfully', data: task })

    }
)

/* ==================== Update Task Controller ==================== */
const updateTaskController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser
        const { title, categoryId, body, items, shared, type } = req.body

        const task = await taskModel.findOne({ _id: id, addBy: userId })
        if (!task) return res.status(404).json({ message: 'Task Not Found' })

        if (title) {
            if (title === task.title) return res.status(400).json({ message: 'Title is same as previous' })
            task.title = title
        }

        if (categoryId) {
            const category = categoryModel.findOne({ _id: categoryId, addBy: userId })
            if (!category) return res.status(404).json({ message: 'Category Not Found' })

            if (categoryId === task.categoryId) return res.status(400).json({ message: 'Category is same as previous' })

            task.categoryId = categoryId
        }

        if (shared) {
            if (shared === task.shared) return res.status(400).json({ message: 'Shared status is same as previous' })
            task.shared = shared
        }

        if (type === 'text' && body) {
            if (body === task.body) return res.status(400).json({ message: 'Body is same as previous' })
            task.body = body
        }

        if (type === 'list' && items) {
            if (JSON.stringify(items) === JSON.stringify(task.items)) return res.status(400).json({ message: 'Items are same as previous' })
            task.items = items
        }

        await task.save()

        res.status(200).json({ message: 'Task Updated Successfully', data: task })

    }
)

/* ==================== Delete Task Controller ==================== */
const deleteTaskController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser

        const task = await taskModel.findOneAndDelete({ _id: id, addBy: userId })
        if (!task) return res.status(404).json({ message: 'Task Not Found' })

        res.status(200).json({ message: 'Task Deleted Successfully', data: task })

    }
)



export {
    createTaskController,
    getTasksPrivateController,
    getTasksPublicController,
    getTaskByIDController,
    updateTaskController,
    deleteTaskController
}