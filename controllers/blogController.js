const blogRouter = require("express").Router()
const Blog = require("../models/blogModel")
//const User = require("../models/userModel")
const jwt = require("jsonwebtoken")


/*
const getTokenFrom = request => {
    const authorization = request.get("authorization")
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "")
    }
    return null
}
*/


blogRouter.get("/", async (request, response) => {

    const blogs = await Blog
        .find({}).populate("user", { username: 1, name: 1 })

    return response.json(blogs)

})

blogRouter.post("/", async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" })
    }

    //const user = await User.findById(decodedToken.id)
    const user = response.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })


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

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    return response.status(201).json(savedBlog)

})

blogRouter.delete("/:id", async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" })
    }

    //const user = await User.findById(decodedToken.id)
    const user = response.user

    const blogToDelete = await Blog.findById(request.params.id)

    if (!blogToDelete || blogToDelete.user.toString() !== user.id) {
        return response.status(401).json({ error: "Unauthorized to delete this blog" })
    }

    console.log("Deleting blog", request.params.id)

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