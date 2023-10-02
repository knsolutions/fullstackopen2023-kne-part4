const mongoose = require("mongoose")
const Blog = require("../models/blogModel")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./testhelper")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    //console.log("cleared")

    await Blog.insertMany(helper.initialBlogs)

    /*
    for (let blog of initialBlogs) {
    let blogObject = new BLog(blog)
    await blogObject.save()
    }

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    */

    //console.log("done")
}, 15000)



test("Blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
}, 15000)


test("there are two blogs", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 10000)


test("note without url or title is not added", async () => {
    const newBlog = {
        author: "Jackie Chan"
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
}, 10000)


test("a valid blog can be added", async () => {
    const newBlog = {
        title: "Node shit",
        author: "Michael Chan",
        url: "org.net",
        likes: 0
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain("Node shit")

}, 10000)

test("check that undifed like are set to 0", async () => {
    const newBlog = {
        title: "Node shit",
        author: "Michael Chan",
        url: "Netti.fi"
    }

    const createdBlog = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    expect(createdBlog.body.likes).toBe(0)

}, 10000)

test("id field should be according to model", async () => {
    const blogsAtEnd = await helper.blogsInDb()

    blogsAtEnd.forEach((blog) => {
        expect(blog.id).toBeDefined()
    })

}, 10000)


test("the first blog is about React patterns", async () => {
    const response = await api.get("/api/blogs")

    const titles = response.body.map(b => b.title)

    expect(titles).toContain("React patterns")
    //expect(response.body[0].title).toBe("React patterns")
}, 10000)

afterAll(async () => {
    await mongoose.connection.close()
}, 10000)