const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    try {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    } catch (error) {
      console.error('Error in test setup:', error)
    }
  })
  
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test("id property is named id", async () => {
    const response = await api.get("/api/blogs")
    response.body.forEach((blog) => {
      assert(blog.id)
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
      assert.deepStrictEqual(resultBlog.body, processedBlogToView)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = "678bca718bc121f8cb020feb"

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test("post request creates a new blog post", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "https://test.com",
        likes: 10
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(blog => ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      }))
      
      assert(contents.some(blog => 
        blog.title === newBlog.title &&
        blog.author === newBlog.author &&
        blog.url === newBlog.url &&
        blog.likes === newBlog.likes
      ))
    })
  })

  describe("blog post with missing properties", () => {
    test("if likes property is missing, it will default to 0", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "https://test.com"
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test("if title and url properties are missing, return 400 Bad Request", async () => {
      const newBlog = {
        author: "Test author"
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = { ...blogToUpdate, likes: 100 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const processedBlogToUpdate = JSON.parse(JSON.stringify(updatedBlog))
      assert.deepStrictEqual(blogsAtEnd[0], processedBlogToUpdate)
    })
  })
})

after(async () => {
  try {
    await mongoose.connection.close()
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
})

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

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the likes of all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('when list has no blogs, equals 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.strictEqual(result, listWithOneBlog[0])
  })

  test('when list has multiple blogs, equals the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })
})

describe('most blogs', () => {
  test('when list has no blogs, equals null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs, equals the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('when list has no blogs, equals null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs, equals the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})