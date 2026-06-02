// @ts-nocheck
import { test, expect,  } from '@playwright/test'
import { response } from '../../blog-list-backend/app';
test.describe('Blog app', () => {
  test.beforeEach(async ({page,request}) => {
    await request.post('http://localhost:3005/api/testing/reset')
    await request.post('http://localhost:3005/api/users', {
      data: {
        username: 'testuser',
        name: 'Chris Tester',
        password: 'password123'
      }
    })
    
      await page.goto('http://localhost:5173/login')
  })
test('Login form is shown', async ({ page }) => {
  const loginHeading = page.getByText( /Log in/i)
  await expect(loginHeading).toBeVisible();
  const usernameInput = page.locator('input[name="Username"]')
  await expect(usernameInput).toBeVisible()
})
test.describe('Login', () => {
  test('succeeds with correct credentials', async ({page}) => {
    test.setTimeout(10000)
    await page.locator('input[name="Username"]').fill('testuser')
    await page.locator('input[name="Password"]').fill('password123')
    await page.getByRole('button',{name:/login/i}).click()
    await page.pause()
    await expect(page.getByRole('button',{name:/logout/i})).toBeVisible()
  })
  test('fails with wrong credentials', async ({page}) => {
    await page.locator('input[name="Username"]').fill('wronguser')
    await page.locator('input[name="Password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'login'}).click()
    const notification = page.locator('.error')
    await expect(notification).toBeVisible()
  })
  test.describe('When logged in', () => {
    test.beforeEach(async ({page}) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button',{name: /login/i}).click()
      await expect(page.getByRole('button',{name:/logout/i})).toBeVisible

    })
  })
  test('a new blog can be created', async ({page}) => {
    await page.getByRole('link', {name: 'new blog'}).click()
    await page.getByRole('textbox', {name: 'title'}).fill('Testing Playwright E2E')
    await page.getByRole('textbox', { name: 'author'}).fill('Helsinki Developers')
    await page.getByRole('textbox', { name: 'url'}).fill('https://debby.com')
    await page.getByRole('button', { name: /create/i}).click()
    const blogElement = page.locator('.blog').filter({ hasText: 'Testing Playwright E2E'})
    await expect(blogElement).toBeVisible()
  })
  test('a blog can be liked', async ({page}) => {
    await page.getByRole('button', {name: /new/i}).click()
    await page.locator('#title-input').fill('Blog to be Liked')
    await page.locator('#author-input').fill('Test Author')
    await page.locator('#url-input').fill('https://testurl.com')
    await page.getByRole('button', {name: /create/i}).click()
    await page.getByText('Blog to be Liked Test Author').getByRole('button', {name: 'view'}).click()
    await page.getByRole('button', {name: 'like'}).click()
    await expect (page.getByText('likes 1')).toBeVisible()
    test('a blog can be deleted by the creator', async ({page}) => {
      await createBlog(page, 'Delete Me', 'Autor', 'http://url.com')
      const blog = page.locator('.blog').filter({hasText: 'Delete Me'})
      await blog.getByRole('button', {name: 'view'}).click()
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', {name: 'remove'}).click()
      await expect(page.getByText('Delete Me')).not.toBeVisible()
    })
    test('only the creator sees the delete button', async ({page, request}) => {
      await createBlog(page, 'Creator Blog', 'Author','http://url.com')
      await page.getByRole('button', {name: 'logout'}).click()
      await request.post('/api/users', {data: {username: 'other', password: 'passord', name: 'Other'}})
      await page.getByTestId('username').fill('other')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login'}).click()
      const blog = page.locator('.blog').filter({hasText: 'Creator Blog'})
      await blog.getByRole('button', {name: 'view'}).click()
      await expect(blog.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })
    test('blogs are ordered according to likes', async ({ page}) => {
      await createBlog(page, 'Most Likes', 'A', 'url', 10)
      await createBlog(page, 'Second Most', 'B', 'url', 5)
      await createBlog(page, 'Least Likes', 'C','url', 0)
      const blogTitles = await page.locator('.blog-title').allTextContents()
      expect(blogTitles[0]).toContain('Most Likes')
      expect(blogTitles[1]).toContain('Second Most')
      expect(blogTitles[2]).toContain('Least Likes')
    })
  })
})
async function createBlog(page, title, author, url, likes) {
  await page.getByRole('button',{name: 'new blog'}).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', {name: 'create'}).click()
  await page.getByText(`${title} ${author}.waitFor()`)
  const blogElement = page.locator('.blog').filter({hasText: title})
  await blogElement.getByRole('button', {name: 'view'}).click()
  for (let i = 0; i < likes; i++) {
    await blogElement.getByRole('button', {name: 'like'}).click()
    await page.waitForTimeout(5000)
  }

  
}


});
