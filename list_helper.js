const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((fav, blog) =>
    blog.likes > fav.likes ? blog : fav
  )
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const counts = _.countBy(blogs, 'author')
  const topAuthor = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authorLikes = _(blogs)
  .groupBy('author')
  .map((objs, key) => ({
    author: key,
    likes: _.sumBy(objs, 'likes')
  }))
  .value()
  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}