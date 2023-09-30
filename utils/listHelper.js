/*
const reverse = (string) => {
    return string
        .split("")
        .reverse()
        .join("")
}

const average = array => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return array.length === 0
        ? 0
        : array.reduce(reducer, 0) / array.length
}
*/

var _ = require("lodash")


const dummy = (blogs) => {

    return blogs.length === 0
        ? 1
        : 1
}

const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        //console.log("sum: ", sum, "item: ", item.likes)
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    if (blogs.length === 1) {
        return blogs[0]
    }

    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return sortedBlogs[0]
}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) {
        return null
    }

    const authors = _.countBy(blogs, "author")
    console.log("authors: ", authors)
    const authorWithMostBlogs = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
    console.log("authorWithMostBlogs: ", authorWithMostBlogs)

    return {
        author: authorWithMostBlogs,
        numberOfBlogs: authors[authorWithMostBlogs],
    }
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) {
        return null
    }

    const likesPerAuthor = _.chain(blogs)
        .groupBy("author")
        .mapValues((authorBlogs) => _.sumBy(authorBlogs, "likes"))
        .value()

    const authorWithMostLikes = _.maxBy(_.keys(likesPerAuthor), (author) => likesPerAuthor[author])


    return {
        author: authorWithMostLikes,
        numberOfLikes: likesPerAuthor[authorWithMostLikes]
    }
}


module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
