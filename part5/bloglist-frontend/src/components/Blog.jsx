import { useState } from 'react'

const Blog = ({ blog, handleLikes, handleDelete, loggedUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const onLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    const blogId = blog.id
    handleLikes(blogId, updatedBlog)
  }

  const onDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      const blogId = blog.id || blog._id
      handleDelete(blogId)
    }
  }

  const isOwner =
  blog.user &&
  loggedUser &&
  (
    ((blog.user.id || blog.user._id) && (blog.user.id || blog.user._id) === (loggedUser.id || loggedUser._id)) ||
    (blog.user.username && blog.user.username === loggedUser.username)
  )

    console.log('Blog user:', blog.user);
    console.log('Logged user:', loggedUser);
    console.log('Is owner:', isOwner);
    


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes} <button onClick={onLike}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {isOwner && (
            <div>
              <button onClick={onDelete}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog