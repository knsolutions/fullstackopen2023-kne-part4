const express = require("express")
const cors = require("cors")
const config = require("./utils/config")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const personsRouter = require("./controllers/persons")
const mongoose = require("mongoose")


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


app.use("/api/persons", personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app