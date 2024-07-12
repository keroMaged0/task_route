import userModel from "../../DB/models/user.model.js";
import { AppError } from "../utils/app.Error.js";

export const uniqueEmail = async (req, res, next) => {
    // Destructuring the request body
    const { email } = req.body;

    // check if unique email address
    const uniqueEmail = await userModel.findOne({ email: email });
    if (uniqueEmail) return  res.status(400).json({ message: 'Email already exists' });

    next();
}

