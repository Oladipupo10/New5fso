const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Mosh',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Node.js is powerful',
    author: 'John',
    url: 'http://example.com/2',
    likes: 10,
  },
]
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
  }
module.exports = {
  initialBlogs,
  blogsInDb,
}