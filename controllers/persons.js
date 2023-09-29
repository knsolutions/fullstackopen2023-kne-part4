const personsRouter = require("express").Router()
const Person = require("../models/person")

/*
personsRouter.get("/", (request, response) => {
    response.static("index.html")
})
*/


personsRouter.get("/", (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(error => next(error))
})

personsRouter.get("/info", (request, response, next) => {
    const date = new Date()
    response.type("text/html")

    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })
        .catch(error => next(error))

})

personsRouter.get("/:id", (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

personsRouter.post("/", (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name missing or person missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })


    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))

})



personsRouter.delete("/:id", (request, response, next) => {
    console.log("deleting Person", request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

personsRouter.put("/:id", (request, response, next) => {
    const { name, number } = request.body


    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

module.exports = personsRouter