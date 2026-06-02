const assert = require('node:assert')
const config = require('../utils/config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)
jest.setTimeout(250000)
let token = null
//
beforeEach(async () => {
  try {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  } catch (error) {
    console.error('FULL ERROR MESSAGE:', error)
  }
  const newUser = {
    username: 'chris',
    password: 'sunday5555',
  };
  await api.post('/api/users').send(newUser);
  const result = await api.post('/api/login').send(newUser);
  token = result.body.token;
})
describe('when there are initially some blogs saved', () => {

  test('blogs are returned as json (4.8)', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned (4.8)', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property is named id (4.9)', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    assert(blog.id !== undefined)
  })

})

describe('addition of a new blog', () => {

  test('a valid blog can be added (4.10)', async () => {
    const newBlog = {
      title: 'async/await rocks',
      author: 'Chris',
      url: 'http://example.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('async/await rocks'))
  })

  test('if likes property is missing, it defaults to 0 (4.11)', async () => {
    const newBlog = {
      title: 'no likes yet',
      author: 'Chris',
      url: 'http://example.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added (4.12)', async () => {
    const newBlog = {
      author: 'Chris',
      url: 'http://example.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  test('blog without url is not added (4.12)', async () => {
    const newBlog = {
      title: 'missing url',
      author: 'Chris',
      likes: 5,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  // exercise 4.13 delete blog
      test('a blog can be deleted ', async () =>
      {
        const blogsAtStart = await
        helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      })
      test('a blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    likes: blogToUpdate.likes + 10
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // check returned value
  assert.strictEqual(response.body.likes, updatedData.likes)

  // check database
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, updatedData.likes)
})

})
afterAll(async () => {
  await mongoose.connection.close()
})