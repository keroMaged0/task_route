import jwt from "jsonwebtoken"
import userModel from "../../DB/models/user.model.js";


/* ==================== Authentication Middleware ==================== */
const authentication = async (req, res, next) => {
    // get token from header
    const token = req.header('access-token')

    // check if token is found
    if (!token) return res.status(401).json({ message: 'not found access-token ' });

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE)
        req.authUser = decoded

        const user = await userModel.findById(decoded.userId)
        if (!user) return res.status(401).json({ message: 'User not found' });

        // if user is not verified & login
        if (!user.isVerifiedEmail) return res.status(401).json({ message: 'User not verified' });
        if (!user.isActive) return res.status(401).json({ message: 'User not login' });

        // if change password
        if (user?.ChangePassword) {
            let time = parseInt(user?.ChangePassword.getTime() / 1000)
            if (time > decoded.iat) return next(new appError('!this user not authorization ', 401))
        }

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });

    }
}


/* ==================== Authorization Middleware ==================== */
const authorization = (...allowedTo) => {
    return (req, res, next) => {
        const { role } = req.authUser;
        if (!allowedTo.toString().includes(role)) return res.status(401).json({ message: 'You are not authorized' });;
        next();
    }
}


export {
    authentication,
    authorization,

}