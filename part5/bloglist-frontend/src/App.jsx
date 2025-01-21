import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { use } from 'react'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')  
  const [user, setUser] = useState(null)
  
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username,
        password
      })
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setErrorMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch (error) {
      setErrorMessage(error.response.data.error || 'Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const addBlog = (event) => {
    try {
      event.preventDefault()
      blogService.create(newBlog).then(blog => {
        setBlogs(blogs.concat(blog))
        setNewBlog({
          title: '',
          author: '',
          url: ''
        })
      })

      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error || 'Error adding blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

    return (
      <div>
        {user === null ? (
          <div>
            <h1>Log in to application</h1>
            <Notification message={errorMessage} />
            {LoginForm(handleLogin, username, setUsername, password, setPassword)}
          </div>
        ) : (
          <div>
            <h2>blogs</h2>
            <Notification message={errorMessage} />
            <p>
              {user.name} logged-in 
              <button onClick={() => {
                window.localStorage.removeItem('loggedBlogappUser')
                setUser(null)
              }}>
                logout
              </button>
            </p>
            {BlogForm(handleBlogChange, newBlog, addBlog)}
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        )}
      </div>
    )
  }

export default App