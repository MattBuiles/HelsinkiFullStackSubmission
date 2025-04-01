import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { test, expect, vi } from 'vitest'

test('renders title and author but does not render url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bob',
    url: 'https://example.com',
    likes: 0,
    user: {
      id: '123',
      username: 'bob',
      name: 'Bob Builder'
    }
  }

  const { container } = render(
    <Blog 
      blog={blog} 
      handleLikes={() => {}} 
      handleDelete={() => {}} 
      loggedUser={{ username: 'bob' }} 
    />
  )

  // Comprueba que se renderiza el título y el autor
  expect(screen.getByText(/Component testing is done with react-testing-library/i)).toBeDefined()
  expect(screen.getByText(/Bob/i)).toBeDefined()

  // Comprueba que los detalles no se muestran
  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).toBeNull()
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bob',
    url: 'https://example.com',
    likes: 0,
    user: {
      id: '123',
      username: 'bob',
      name: 'Bob Builder'
    }
  }

  const mockHandleLikes = vi.fn()
  const { container } = render(
    <Blog 
      blog={blog} 
      handleLikes={mockHandleLikes} 
      handleDelete={() => {}} 
      loggedUser={{ username: 'bob' }} 
    />
  )

  const user = userEvent.setup()
  // Hacemos clic en el botón "view" para mostrar los detalles
  const button = screen.getByText('view')
  await user.click(button)

  // Comprueba que se muestra el contenedor con detalles mediante la clase .blogDetails
  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).toBeDefined()
  // Verificamos que se muestra la URL y los likes
  expect(detailsDiv).toHaveTextContent('https://example.com')
  expect(detailsDiv).toHaveTextContent(/likes: 0/i)
})

test('clicking the like button calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bob',
    url: 'https://example.com',
    likes: 0,
    user: {
      id: '123',
      username: 'bob',
      name: 'Bob Builder'
    }
  }

  const mockHandleLikes = vi.fn()
  render(
    <Blog 
      blog={blog} 
      handleLikes={mockHandleLikes} 
      handleDelete={() => {}} 
      loggedUser={{ username: 'bob' }} 
    />
  )

  const user = userEvent.setup()
  // Primero se hace click en "view" para mostrar el botón de like
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandleLikes).toHaveBeenCalledTimes(2)
})

test('new blog form calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const { container } = render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  // Suponiendo que los inputs tienen name "title", "author" y "url"
  const inputTitle = container.querySelector('input[name="title"]')
  const inputAuthor = container.querySelector('input[name="author"]')
  const inputUrl = container.querySelector('input[name="url"]')

  await user.type(inputTitle, 'Testing blog form')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'http://testurl.com')

  // Simular el envío del formulario
  const submitButton = container.querySelector('button[type="submit"]')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing blog form',
    author: 'Test Author',
    url: 'http://testurl.com'
  })
})