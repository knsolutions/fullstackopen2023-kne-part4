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
    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).toContain("React patterns")
    //expect(response.body[0].title).toBe("React patterns")
}, 15000)


test("UPDATE a blog by ID", async () => {
    const blogToUpdate = await helper.blogsInDb()

    const updatedData = {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 12
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate[0].id}`)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const updatedBlog = response.body
    expect(updatedBlog.title).toBe(updatedData.title)
    expect(updatedBlog.author).toBe(updatedData.author)
    expect(updatedBlog.likes).toBe(updatedData.likes)
}, 10000)


test("DELETE a blog by Id", async () => {

    const blogToDelete = await helper.blogsInDb()

    console.log(blogToDelete[0])

    await api
        .delete(`/api/blogs/${blogToDelete[0].id}`)
        .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length -1)
}, 10000)


afterAll(async () => {
    await mongoose.connection.close()
}, 10000)