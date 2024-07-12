// to catch error
process.on('uncaughtException', ((err) =>
    console.log('error', err)
))

import * as routers from "./modules/index.routes.js"

import { globalResponseError } from "./middleware/global-response.middleware.js"
import { rollBackDocumentMiddleware } from "./middleware/rollback_documents.middleware.js"

export const initiateApp = (app, express) => {

    app.use(express.json())

    // router api
    app.use('/auth', routers.authRouter)
    app.use('/user', routers.userRouter)
    app.use('/category', routers.categoryRouter)
    app.use('/task', routers.taskRouter)

    // !not found end point
    app.use('*', (req, res, next) => {
        res.json({ message: "message not found " })
    })

    // global Error
    app.use(globalResponseError, rollBackDocumentMiddleware)

    // to catch error
    process.on('unhandledRejection', (err =>
        console.log('error', err)
    ))

}