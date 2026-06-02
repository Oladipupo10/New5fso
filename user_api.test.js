
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const { before } = require('lodash')
const { config } = require('dotenv')

const api = supertest(app)
beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash: 'hashedpassword'
  })

  await user.save()
})

test('valid user is created', async () => {
  const newUser = {
    username: 'chris',
    name: 'Christopher',
    password: '12345'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const users = await User.find({})
  assert.strictEqual(users.length, 2)
})

test('username must be unique', async () => {
  const newUser = {
    username: 'root',
    name: 'Duplicate',
    password: '12345'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('unique'))
})

test('username must be at least 3 chars', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short',
    password: '12345'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('username'))
})

test('password must be at least 3 chars', async () => {
  const newUser = {
    username: 'validuser',
    name: 'ShortPass',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('password'))
})

test('password is required', async () => {
  const newUser = {
    username: 'validuser',
    name: 'NoPass'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('password'))
})

afterAll(async () => {
  await mongoose.connection.close()
})