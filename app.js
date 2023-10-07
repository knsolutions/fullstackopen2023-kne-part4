const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("express-async-errors")


const blogRouter = require("./controllers/blogController")
const usersRouter = require("./controllers/userController")
const loginRouter = require("./controllers/loginController")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const config = require("./utils/config")

//const http = require('http')

const url = config.MONGODB_URI

mongoose.set("strictQuery", false)

logger.info("connecting to", url)

mongoose.connect(url)
    .then( () => {
        logger.info("connected to MongoDB")
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message)
    })

const app = express()

app.use(cors())
app.use(express.static("dist"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use("/api/blogs", blogRouter)
//app.use("/api/blogs", userExtractor, blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app