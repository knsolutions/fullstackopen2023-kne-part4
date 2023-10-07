const logger = require("./logger")
const morgan = require("morgan")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


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
    } else if (error.name ===  "JsonWebTokenError") {
        return response.status(400).json({ error: "token missing or invalid" })
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({
            error: "token expired"
        })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization")

    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "")
    } else {
        request.token = null
    }

    next()
}

const userExtractor = async (request, response, next) => {

    const token = request.token

    if (!token) {
        return next()
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {
            return next()
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return next()
        }

        response.user = user
    } catch (error) {
        return next()
    }

    next()
}

module.exports = {
    unknownEndpoint, errorHandler, requestLogger, tokenExtractor, userExtractor
}