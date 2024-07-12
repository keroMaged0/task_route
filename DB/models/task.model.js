import mongoose from "mongoose";

//============================== create the user schema ==============================//
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: ['2', 'title must be at least 2 characters long'],
        maxLength: ['200', 'title must be at most 100 characters long'],
        lowercase: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    addBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    shared: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'list'],
        required: true
    },
    body: {
        type: String
    },
    items: [{
        text: String
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, { timestamps: true })



export default mongoose.models.Task || mongoose.model('Task', taskSchema)

