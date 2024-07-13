import categoryModel from "../../../DB/models/category.model.js"
import taskModel from "../../../DB/models/task.model.js"
import { catchError } from "../../middleware/global-response.middleware.js"
import { ApiFeature } from "../../service/api_feature.service.js"

/* ==================== Get All Category Controller ==================== */
const getCategoriesController = catchError(
    async (req, res) => {
        const category = await categoryModel.find()
        if (!category) return res.status(404).json({ message: 'Category Not Found' })

        res.status(200).json({ message: 'Successfully', data: category })
    }
)

/* ==================== Create Category Controller ==================== */
const createCategoryController = catchError(
    async (req, res) => {
        const { name } = req.body
        const { userId } = req.authUser

        const category = await categoryModel.findOne({ addBy: userId, name: name })
        if (category) return res.status(400).json({ message: 'Category already exists' })

        const newCategory = new categoryModel({
            name: name,
            addBy: userId
        })

        await newCategory.save()

        res.status(200).json({ message: 'Successfully', data: newCategory })

    }
)

/* ==================== Get Category By Id Controller ==================== */
const getCategoryByIdController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser

        const category = await categoryModel.findOne({ _id: id, addBy: userId })
        if (!category) return res.status(404).json({ message: 'Category Not Found' })

        res.status(200).json({ message: 'Successfully', data: category })

    }
)

/* ==================== Update Category Controller ==================== */
const updateCategoryController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser
        const { name } = req.body

        const category = await categoryModel.findOne({ _id: id, addBy: userId })
        if (!category) return res.status(404).json({ message: 'Category Not Found' })

        const uniqueName = await categoryModel.findOne({ name: name, addBy: userId })
        if (uniqueName) return res.status(400).json({ message: 'Category already exists' })

        if (name === category.name) return res.status(400).json({ message: 'name is match old' })

        category.name = name

        await category.save()

        res.status(200).json({ message: 'Successfully', data: category })
    }
)

/* ==================== Delete Category Controller ==================== */
const deleteCategoryController = catchError(
    async (req, res) => {
        const { id } = req.params
        const { userId } = req.authUser

        const category = await categoryModel.findOneAndDelete({ _id: id, addBy: userId })
        if (!category) return res.status(404).json({ message: 'Category Not Found' })

        await taskModel.deleteMany({ categoryId: category._id })

        res.status(200).json({ message: 'Successfully', data: category })
    }
)

/* ==================== Get All Category Specific User Controller ==================== */
const getAllCategorySpecificUserController = catchError(
    async (req, res) => {
        const { userId } = req.authUser
        const { page, size, sort, ...query } = req.query

        const apiFeature = new ApiFeature(req.query, categoryModel.find({ addBy: userId }))
        .pagination()
        .sorting(sort) 

        const category = await apiFeature.mongooseQuery
            .populate([
                { path: 'addBy', select: 'name' },
                { path: 'updatedBy', select: 'name' },
                { path: 'Tasks' },
            ])

        if (!category) return res.status(404).json({ message: 'Category Not Found' })


        res.status(200).json({ message: 'Successfully', data: category })

    }
)



export {
    createCategoryController,
    getCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategorySpecificUserController,

}