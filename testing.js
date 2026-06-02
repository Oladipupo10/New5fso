const router = require('express').Router()
const { response } = require('express')
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
router.post('/reset', async(request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})
module.exports = router