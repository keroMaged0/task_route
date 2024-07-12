export const rollBackDocumentMiddleware = async (req, res, next) => {
    if (req.documents) {
        const { model, modelId } = req.documents
        await model.findByIdAndDelete(modelId)
    }
} 