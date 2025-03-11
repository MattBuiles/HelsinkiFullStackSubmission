import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { use } from 'react'
import Togglable from './components/Togglable'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

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

  const handleUsernameChange= ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange= ({ target }) => {
    setPassword(target.value)
  }

  const addBlog = (blogObject) => {
    try {
      blogService.create(blogObject).then(blog => {
        setBlogs(blogs.concat(blog))
      })

      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
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

  const handleLikes = (blogId, updatedBlog) => {
    try {
      blogService.update(blogId, updatedBlog).then(returnedBlog => {
        setBlogs(blogs
          .map(b => b.id !== blogId ? b : returnedBlog)
          .sort((a, b) => b.likes - a.likes)
        )
      })
    } catch (error) {
      setErrorMessage(error.response.data.error || 'Error updating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = (blogId) => {
    try {
      blogService.remove(blogId).then(() => {
        setBlogs(blogs.filter(b => (b.id || b._id) !== blogId))
        setErrorMessage('Blog deleted')
        setTimeout(() => { setErrorMessage(null) }, 5000)
      })
    } catch (error) {
      setErrorMessage(error.response.data.error || 'Error deleting blog')
      setTimeout(() => { setErrorMessage(null) }, 5000)
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
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

    return (
      <div>
        {user === null ? (
          <div>
            <h1>Log in to application</h1>
            <Notification message={errorMessage} />
            <Togglable buttonLabel='login'>
              <LoginForm 
                handleLogin={handleLogin} 
                username={username}
                handleUsernameChange={handleUsernameChange} 
                password={password}
                handlePasswordChange={handlePasswordChange}
              />
            </Togglable>
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
            <Togglable buttonLabel='new blog'>
              <BlogForm
                createBlog={addBlog}
              />
            </Togglable>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleDelete={handleDelete} loggedUser={user} />
            )}
          </div>
        )}
      </div>
    )
  }

export default App