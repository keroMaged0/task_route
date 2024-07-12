import mongoose from "mongoose";


//============================== create the user schema ==============================//
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        minLength: ['2', 'Name must be at least 2 characters long'],
        maxLength: ['100', 'Name must be at most 100 characters long'],
    },
    addBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }})

categorySchema.virtual('Tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'categoryId'
})



export default mongoose.models.Category || mongoose.model('Category', categorySchema)

