const listHelper = require("../utils/listHelper")

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const listWithOneBlog = [
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

describe("mostLikes", () => {
    test("No blogs", () => {
        const blogs = []

        const result = listHelper.mostLikes(blogs)
        expect(result).toBeNull()
    })

    test("One blog", () => {

        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({ author: "Edsger W. Dijkstra", numberOfLikes: 5 })
    })

    test("Many blogs", () => {

        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author: "Edsger W. Dijkstra", numberOfLikes: 17 })
    })
})

describe("Most Blogs", () => {

    test ("No blogs", () => {
        const blogs = []

        const result = listHelper.mostBlogs(blogs)
        expect(result).toBe(null)
    })

    test("One blog", () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({ author: "Edsger W. Dijkstra", numberOfBlogs: 1 })
    })

    test("Many blogs", () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: "Robert C. Martin", numberOfBlogs: 3 })
    })

})

describe("favorite blog", () => {

    test("No blogs", () => {
        const blogs = []

        const result = listHelper.favoriteBlog(blogs)
        expect(result).toBe(null)
    }
    )

    test("One blog", () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    }
    )

    test("Many blogs", () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    }
    )

})

describe("total likes", () => {

    test("dummy returns one", () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })

    test("total likes test", () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test("test count with one blog", () => {

        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test("test count with many blogs", () => {

        const listWithManyBlogs = [
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 2,
                __v: 0
            }
        ]

        const result = listHelper.totalLikes(listWithManyBlogs)
        expect(result).toBe(14)
    }
    )

})

/*
test("reverse of a", () => {
    const result = reverse("a")

    expect(result).toBe("a")
})

test("reverse of react", () => {
    const result = reverse("react")

    expect(result).toBe("tcaer")
})

test("reverse of saippuakauppias", () => {
    const result = reverse("saippuakauppias")

    expect(result).toBe("saippuakauppias")
})
*/

