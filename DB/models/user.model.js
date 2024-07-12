import mongoose from "mongoose";

import { systemRoles } from "../../src/utils/system_roles.js";

//============================== create the user schema ==============================//
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: ['2', 'Name must be at least 2 characters long'],
        maxLength: ['100', 'Name must be at most 100 characters long'],
        lowercase: true
    },
    email: {
        type: String,
        unique: [true, 'email is required'],
        trim: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [systemRoles.ADMIN, systemRoles.USER],
        default: systemRoles.USER
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isResetPassword: {
        type: Boolean,
        default: false
    },
    ChangePassword: {
        type: Date,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    changePasswordTime: Date,

}, { timestamps: true })



export default mongoose.models.User || mongoose.model('User', userSchema)

