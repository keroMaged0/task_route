import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../../../DB/models/user.model.js";
import { catchError } from "../../middleware/global-response.middleware.js";
import { AppError } from "../../utils/app.Error.js";
import { sendEmailService } from "../../service/send_email.service.js";


/* ==================== Get All Users Controller ==================== */
const allUsersController = catchError(
    async (req, res, next) => {
        const users = await userModel.find({ isDeleted: false })
        if (!users) return next(new AppError('Users Not Found', 404))

        res.status(200).json({ message: 'Successfully', data: users })
    }
)

/* ==================== Get One Users Controller ==================== */
const oneUsersController = catchError(
    async (req, res, next) => {
        const { id } = req.params

        const user = await userModel.findById({ _id: id })
        if (!user) return next(new AppError('user Not Found', 404))
        if (user.isDelete) return next(new AppError('User is deleted', 400))

        res.status(200).json({ message: 'Successfully', data: user })
    }
)

/* ==================== Update User Profile Controller ==================== */
const updateUserProfileController = catchError(
    async (req, res, next) => {
        const { id } = req.params
        const { userId } = req.authUser
        const { name, email } = req.body

        const user = await userModel.findById({ _id: id })

        if (!user || user.isDeleted) return next(new AppError('User Not Found', 404))
        if (user.isVerify == false) return next(new AppError('Please verify email and try agin', 400))
        if (id !== userId) return next(new AppError('You can not update other user profile', 400))

        if (name) {
            if (user.name == name) return next(new AppError('Name is already exist', 400))
            user.name = name
        }

        if (email) {
            if (user.email == email) return next(new AppError('Email is same old', 400))

            const uniqueEmail = await userModel.findOne({ email: email })
            if (uniqueEmail) return next(new AppError('Email already exists', 400))

            user.email = email
            user.isVerifiedEmail = false
            user.isActive = false

            // send verify email
            sendEmailService({ email, type: 'Verify Email' })
        }

        user.updatedBy = user._id

        await user.save()

        res.status(200).json({ message: 'Update User Profile Controller', data: user })
    }
)

/* ==================== Change User Password Controller ==================== */
const changeUserPasswordController = catchError(
    async (req, res, next) => {
        // Destructuring the request body
        const { userId } = req.authUser
        const { oldPassword, newPassword } = req.body

        // check if user exists
        const user = await userModel.findById({ _id: userId })
        if (!user) return next(new AppError('User Not Found', 404))

        // check if user is verify & is login
        if (user.isDeleted === true) return next(new AppError('Please verify email and try agin', 400))
        if (user.isVerifiedEmail === false) return next(new AppError('Please verify email and try agin', 400))
        if (user.isActive == false) return next(new AppError('Please logIn first and try again ', 400))

        // check old password
        const isMatch = bcrypt.compareSync(oldPassword, user.password)
        if (!isMatch) return next(new AppError('Invalid old password please try agin', 400))

        // hash new password    
        const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)

        // update user's password and other details
        user.password = hashedPassword
        user.isActive = false
        user.isVerifiedEmail = false
        user.isChangePassword = true
        user.updatedBy = user._id

        await user.save()

        res.status(200).json({ message: 'Change User Password Successfully' })

    }
)

/* ==================== Delete User Account Controller ==================== */
/* 
* Delete user account by admin account soft delete
*/
const deleteUserByAdminController = catchError(
    async (req, res, next) => {
        const { id } = req.params

        const user = await userModel.findOne({ _id: id, isDeleted: false })
        if (!user) return next(new AppError('User Not Found', 404))

        if (user.role === 'admin') return next(new AppError('You can not delete admin account', 400))

        user.isDeleted = true,
            user.deletedBy = user._id

        await user.save()

        res.status(200).json({ message: 'Delete User Account Successfully', data: user })
    }
)

/* ==================== LogOut Controller ==================== */
/* 
* Log out user by admin account soft delete
*/
const logOutController = catchError(
    async (req, res, next) => {
        const { userId } = req.authUser

        const user = await userModel.findById({ _id: userId })
        if (!user || user.isDeleted) return next(new AppError('User Not Found', 404))

        user.isActive = false
        user.isVerifiedEmail = false,
            user.isDeleted = true,
            user.deletedBy = user._id

        user.save()


        res.status(200).json({ message: 'logOut successfully' })
    }
)

/* ==================== Forget Password Controller ==================== */
const forgetPasswordController = catchError(
    async (req, res, next) => {
        const { email } = req.body

        const user = await userModel.findOne({ email, isDeleted: false })
        if (!user) return next(new AppError('User Not Found', 404))

        if (user.isVerifiedEmail === false) return next(new AppError('Please verify email and try agin', 400))

        sendEmailService({ email, type: 'forgetPassword' })

        res.status(200).json({ message: 'check email to reset password' })
    }
)

/* ==================== Reset Password Controller ==================== */
const resetPasswordController = catchError(
    async (req, res, next) => {
        const { token } = req.params
        const { newPassword } = req.body

        const decoded = jwt.decode(token, process.env.RESET_PASSWORD_SIGNATURE)
        if (!decoded) return next(new AppError('Invalid token', 400))

        const user = await userModel.findOne({ email: decoded.email, isDeleted: false })
        if (!user) return next(new AppError('User Not Found', 404))

        // hash new password
        const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)

        user.password = hashedPassword
        user.isActive = false
        user.isVerifiedEmail = false,
            user.isResetPassword = true,
            user.updatedBy = user._id

        sendEmailService({ email: user.email, type: 'verifyEmail' })

        await user.save()

        res.status(200).json({ message: 'Reset Password Successfully', data: token })
    }
)


export {
    allUsersController,
    oneUsersController,
    updateUserProfileController,
    deleteUserByAdminController,
    changeUserPasswordController,
    logOutController,
    forgetPasswordController,
    resetPasswordController,
}