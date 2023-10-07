const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const helper = require("./testhelper")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)


describe("when there is initially one user at db", () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash("sekret", 10)
        const user = new User({ username: "root", passwordHash })

        await user.save()
    }, 15000)

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen",
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    }, 15000)

    test("creation fails with proper statuscode and message if username already taken", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("expected `username` to be unique")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }, 15000)

    test("Creating a user with a short password", async () => {

        const newUser = {
            username: "testuser",
            name: "Test User",
            password: "sh", // Too short, should fail
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

    })

    test("Creating a user with a short username", async () => {
        const newUser = {
            username: "ts", // Too short, should fail
            name: "Test User",
            password: "testpassword",
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(response.body.error).toBe("Username too short")

    })

    test("Creating a user with a missing password", async () => {
        const newUser = {
            username: "testuser",
            name: "Test User",
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)


        expect(response.body.error).toBe("Password missing")
    })

})