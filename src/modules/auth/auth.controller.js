import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../../../DB/models/user.model.js";

import { catchError } from "../../middleware/global-response.middleware.js";
import { sendEmailService } from "../../service/send_email.service.js";
import { AppError } from "../../utils/app.Error.js";


//=================================== SignUp controller ===================================//   (done)
/*
    * destruct data to body
    * check unique email 
    * verify email
    * create user object
    * save user object in database
*/
const SignUpController = catchError(
    async (req, res, next) => {
        // destruct data to body
        const { name, email, password, role } = req.body

        // hash password
        const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

        // create user object
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role

        })

        sendEmailService({ email: email, type: "verify Email" })

        // save user in db
        await user.save()

        res.json({ success: true, message: "User SignUp Successfully", data: user })
    }
)

//=================================== SignIn controller ===================================// (done)
/*
    * destruct data to body
    * find if found user by email
    * check is valid email password
    * create token
    * change loggedIn true in db
*/
const SignInController = catchError(
    async (req, res, next) => {
        // destruct data to body
        const { email, password } = req.body

        // check if user exists and verify email
        let user = await userModel.findOne({ email })
        if (!user || user.isDeleted) return next(new AppError('!not found user', 404))
        if (!user.isVerifiedEmail) return next(new AppError('please verify email and try again', 404))

        // check if password is correct
        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch) throw new AppError('Invalid email or password', 400);

        // create token
        let token = jwt.sign({
            userId: user._id, role: user.role, email
        }, process.env.LOGIN_SIGNATURE)

        // change isLoggedIn true in db
        user.isActive = true

        await user.save()

        res.status(200).json({ success: true, message: "SingIn successfully", data: token })
    }
)

//=================================== verifyEmail controller ===================================// (done)
/*
    * destruct data from query
    * decode token
    * find by email
    * find user and update 
*/
const verifyEmailController = catchError(
    async (req, res, next) => {
        // destruct data from query
        const { token } = req.params

        // decode token and check
        jwt.verify(token, process.env.VERIFY_EMAIL_SIGNATURE, async (err, decoded) => {

            if (err) return next(new AppError(err, 400))

            // find user model and update
            await userModel.findOneAndUpdate({
                email: decoded.email, isVerifiedEmail: false
            }, {
                isVerifiedEmail: true
            }, { new: true })

            res.json({ success: true, message: "Email verified successfully, please try to login" })
        })

    }
)


export {
    SignUpController,
    SignInController,
    verifyEmailController,
}