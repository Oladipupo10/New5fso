const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const { error } = require('../utils/logger')
blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user' , {
    username: 1, name: 1
  })
  response.json(blogs)
})
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = jwt.sign(userForToken,
process.env.SECRET)
if (!decodedToken.id) {
  return response.status(401).json({
    error:'token invalid '
  })
}
const user = await
User.findById(decodedToken.id)
if (!user) {
  return response.status(400).json({
    error: 'UserId missing or not valid'
  })
}

  //4.12 handle missing url
  if (!body.title || !body.url) {
    return response.status(400).end()
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
const savedBlog = await blog.save()
user.blogs = user.blogs.concat(savedBlog._id)
await user.save()
response.status(201).json(savedBlog)
})
// exercises 4.13 delete blog
blogsRouter.delete('/:id',async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token missing'})
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({error: 'blog not found'})
  }
  if (blog.user.toString() !==decodedToken.id.toString()) {
    return response.status(401).json({error: 'only the creator can delete this blog'})
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
/* UPDATE blog (mainly likes) */
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
  response.json(updatedBlog)
})
module.exports = blogsRouter



