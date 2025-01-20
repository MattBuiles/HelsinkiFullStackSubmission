const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }
]

const testUser = {
  username: 'testuser',
  name: 'Test User',
  password: 'testpass'
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getAuthToken = async (api) => {
  const user = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }

  await api.post('/api/users').send(user)

  const response = await api
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password
    })

  return response.body.token
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  testUser,
  getAuthToken
}