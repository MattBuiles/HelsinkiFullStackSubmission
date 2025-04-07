const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const {errorHandler, userExtractor} = require('../utils/middleware')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const savedBlog = await blog.save()
    // Actualiza el usuario de forma atómica para agregar el nuevo blog,
    // evitando conflictos con el control de versión (optimistic concurrency)
    await User.findByIdAndUpdate(user._id, { $push: { blogs: savedBlog._id } })

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }

    if (!request.user || blog.user.toString() !== request.user.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/reset', async (request, response) => {
  // Borrar todos los blogs
  await Blog.deleteMany({})
  // Limpiar el arreglo de blogs en cada usuario
  await User.updateMany({}, { blogs: [] })
  response.status(204).end()
})

blogsRouter.use(errorHandler)

module.exports = blogsRouter