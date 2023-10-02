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

blogRouter.delete("/:id", async (request, response) => {
    console.log("deleting Person", request.params.id)

    await Blog.findByIdAndRemove(request.params.id)

    return response.status(204).end()

})

blogRouter.put("/:id", async (request, response) => {
    const blog = new Blog(request.body)

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true, runValidators: true, context: "query" })

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).json({ error: "Blog not found" })
    }

})

module.exports = blogRouter