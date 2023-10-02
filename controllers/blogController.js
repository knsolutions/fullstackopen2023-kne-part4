const blogRouter = require("express").Router()
const Blog = require("../models/blogModel")

blogRouter.get("/", async (request, response) => {

    const blogs = await Blog.find({})

    return response.json(blogs)

})

blogRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body)

    if (!blog.title || !blog.author)  {
        return response.status(400).json({
            error: "Title or author missing"
        })
    }

    if (!blog.url) {
        return response.status(400).json({
            error: "URL missing"
        })
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    const savedBlog = await blog.save()

    return response.status(201).json(savedBlog)

})

module.exports = blogRouter