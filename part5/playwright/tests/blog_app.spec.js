const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Login functionality', () => {
  // No usamos el beforeEach global para estos tests

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'login' }).click()
    const loginForm = page.locator('form')
    await expect(loginForm).toBeVisible()
  })

  test('Login fails with wrong credentials', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('wronguser')
    await page.getByLabel('password').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    const errorMessage = page.locator('.error')
    await expect(errorMessage).toBeVisible()
  })

  test('Login succeeds with correct credentials', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('admin')
    await page.getByLabel('password').fill('admin')
    const submitButton = page.locator('form button[type="submit"]')
    await submitButton.click()
    const successNotification = page.locator('.notification.success')
    await expect(successNotification).toContainText("Welcome admin", { timeout: 10000 })
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    // Borrar todos los blogs de la base de datos
    await request.delete('http://localhost:3003/api/blogs/reset')
    // Se asume que el usuario "admin" ya existe en la base de datos
    await page.goto('http://localhost:5173')
    // Iniciar sesión como el usuario admin
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('admin')
    await page.getByLabel('password').fill('admin')
    const submitButton = page.locator('form button[type="submit"]')
    await submitButton.click()
    // Esperar a que aparezca el botón "new blog"
    await page.waitForSelector('button', { hasText: 'new blog', state: 'visible', timeout: 10000 })
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).first().click()
    await page.locator('input[name="title"]').fill('Playwright E2E Test Blog')
    await page.locator('input[name="author"]').fill('Playwright')
    await page.locator('input[name="url"]').fill('http://playwright-blog.com')
    await page.getByRole('button', { name: 'create' }).first().click()
    // Seleccionamos el primer elemento que contenga el texto esperado
    const blog = page.locator('.blog', { hasText: 'Playwright E2E Test Blog' }).first()
    await expect(blog).toContainText('Playwright E2E Test Blog')
  })

  test('a blog can be liked', async ({ page }) => {
    // Crear un blog a dar like
    await page.getByRole('button', { name: 'new blog' }).first().click()
    await page.locator('input[name="title"]').fill('Blog to Like')
    await page.locator('input[name="author"]').fill('Tester')
    await page.locator('input[name="url"]').fill('http://blogtolike.com')
    await page.getByRole('button', { name: 'create' }).first().click()
    
    // Seleccionar el blog creado y expandir sus detalles
    const blog = page.locator('.blog', { hasText: 'Blog to Like' }).first()
    await blog.getByRole('button', { name: 'view' }).first().click()
    
    // Dar like dos veces
    const likeButton = blog.getByRole('button', { name: 'like' }).first()
    await likeButton.click()
    await likeButton.click()
    
    // Verificar que el contador de likes aumentó a 2
    await expect(blog).toContainText(/likes:\s*2/i)
  })

  test('the creator can delete a blog', async ({ page }) => {
    // Create a blog to delete
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.locator('input[name="title"]').fill('Blog to Delete')
    await page.locator('input[name="author"]').fill('Tester')
    await page.locator('input[name="url"]').fill('http://blogtodelete.com')
    await page.getByRole('button', { name: 'create' }).click()
    
    // Expand the blog details
    const blog = page.locator('.blog', { hasText: 'Blog to Delete' })
    await blog.getByRole('button', { name: 'view' }).click()
    
    // Accept the confirmation dialog when deleting (simulate window.confirm)
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    
    // Click the remove button
    await blog.getByRole('button', { name: 'remove' }).click()
    
    // Verify that the blog is no longer visible
    await expect(blog).toHaveCount(0)
  })

  test('only the creator sees the delete button', async ({ page }) => {
    // Crear un blog como usuario creador
    await page.getByRole('button', { name: 'new blog' }).first().click()
    await page.locator('input[name="title"]').fill('Protected Blog')
    await page.locator('input[name="author"]').fill('Creator')
    await page.locator('input[name="url"]').fill('http://protectedblog.com')
    await page.getByRole('button', { name: 'create' }).first().click()
    
    // Expandir detalles; el botón eliminar debe ser visible
    const blog = page.locator('.blog', { hasText: 'Protected Blog' }).first()
    await blog.getByRole('button', { name: 'view' }).first().click()
    await expect(blog.getByRole('button', { name: 'remove' }).first()).toBeVisible()
    
    // Cerrar sesión y entrar como otro usuario
    await page.getByRole('button', { name: 'logout' }).click()
    await page.request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Another User',
        username: 'anotheruser',
        password: 'password'
      }
    })
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('anotheruser')
    await page.getByLabel('password').fill('password')
    const submitButton = page.locator('form button[type="submit"]').first()
    await submitButton.click()
    
    // Verificar que el blog está visible pero sin el botón eliminar
    const blogAfter = page.locator('.blog', { hasText: 'Protected Blog' }).first()
    await blogAfter.getByRole('button', { name: 'view' }).first().click()
    await expect(blogAfter.getByRole('button', { name: 'remove' }).first()).toHaveCount(0)
  })

  test('blogs are arranged in descending order according to likes', async ({ page }) => {
    // Crear blog 1 (0 likes)
    await page.getByRole('button', { name: 'new blog' }).first().click()
    await page.locator('input[name="title"]').fill('Least Liked Blog')
    await page.locator('input[name="author"]').fill('Low')
    await page.locator('input[name="url"]').fill('http://leastliked.com')
    await page.getByRole('button', { name: 'create' }).first().click()
    
    // Cerrar el formulario para que vuelva a aparecer el botón "new blog"
    await page.getByRole('button', { name: 'cancel' }).first().click()
    // Esperar a que vuelva a ser visible el botón "new blog"
    await page.waitForSelector('button', { hasText: 'new blog', state: 'visible', timeout: 10000 })

    // Crear blog 2 (se dará varios likes)
    await page.getByRole('button', { name: 'new blog' }).first().click()
    await page.locator('input[name="title"]').fill('Most Liked Blog')
    await page.locator('input[name="author"]').fill('High')
    await page.locator('input[name="url"]').fill('http://mostliked.com')
    await page.getByRole('button', { name: 'create' }).first().click()

    // Dar like tres veces a "Most Liked Blog"
    const blog2 = page.locator('.blog', { hasText: 'Most Liked Blog' }).first()
    await blog2.getByRole('button', { name: 'view' }).first().click()
    const likeButton2 = blog2.getByRole('button', { name: 'like' }).first()
    await likeButton2.click()
    await likeButton2.click()
    await likeButton2.click()

    // Dar like una vez a "Least Liked Blog"
    const blog1 = page.locator('.blog', { hasText: 'Least Liked Blog' }).first()
    await blog1.getByRole('button', { name: 'view' }).first().click()
    const likeButton1 = blog1.getByRole('button', { name: 'like' }).first()
    await likeButton1.click()

    // Recargar la página para aplicar la nueva ordenación
    await page.reload()
    
    // Verificar que el primer blog en la lista es "Most Liked Blog"
    const blogs = page.locator('.blog')
    await expect(blogs.nth(0)).toContainText('Most Liked Blog')
  })
})