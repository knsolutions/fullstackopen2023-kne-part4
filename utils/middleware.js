const morgan = require("morgan")
const logger = require("./utils/logger")




morgan.token("postdata", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
    return null
})

const morganFormat = ":method :url :status :res[content-length] - :response-time ms :postdata"

morgan(morganFormat, {
    skip: (req) => req.method !== "POST"
})

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method)
    logger.info("Path:  ", request.path)
    logger.info("Body:  ", request.body)
    logger.info("---")
    next()
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        console.log("Validation error")
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    unknownEndpoint, errorHandler, requestLogger
}