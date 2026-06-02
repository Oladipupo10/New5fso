const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes} = require('../utils/list_helper')

describe('dummy', () => {
  test('returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog', () => {
    const blogs = [
      {
        title: "Test blog",
        author: "Chris",
        url: "test.com",
        likes: 5
      }
    ]

    const result = totalLikes(blogs)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: "A", likes: 5 },
      { title: "B", likes: 10 },
      { title: "C", likes: 3 }
    ]

    const result = totalLikes(blogs)
    expect(result).toBe(18)
  })
})


describe('favorite blog', () => {

  test('when list is empty, return null', () => {
    const result = favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when list has one blog, it is the favorite', () => {
    const blogs = [
      {
        title: "Only blog",
        author: "Chris",
        likes: 5
      }
    ]

    const result = favoriteBlog(blogs)

    expect(result).toEqual({
      title: "Only blog",
      author: "Chris",
      likes: 5
    })
  })

  test('returns blog with most likes', () => {
    const blogs = [
      { title: "A", author: "X", likes: 5 },
      { title: "B", author: "Y", likes: 10 },
      { title: "C", author: "Z", likes: 3 }
    ]

    const result = favoriteBlog(blogs)

    expect(result).toEqual({
      title: "B",
      author: "Y",
      likes: 10
    })
  })
})


describe('most blogs', () => {
  const blogs = [
    {
      title: "Introduction to React patterns",
      author: "Tapas adikary",
      likes: 7
    },
    {
      title: "Programming with python ",
      author: "Doglas chris",
      likes: 5
    },
    {
      title: "Electricity generation ",
      author: "Douglas chris",
      likes: 12
    },
    {
      title: "Full stack open ",
      author: "Boluwatife Oguns",
      likes: 10
    },
    {
      title: "The effects of negotiations ",
      author: "Boluwatife Oguns",
      likes: 0
    },
    {
      title: "Kiode",
      author: "Boluwatife Oguns",
      likes: 2
    }
  ]
  
  test('returns author with most blogs', () => {
    const result = mostBlogs(blogs)

    expect(result).toEqual({
      author: "Boluwatife Oguns",
      blogs: 3
    })
  })
})


describe('most likes', () => {
  const blogs = [
    {
      title: "Introdution to React patterns",
      author: "Tapas adikary",
      likes: 7
    },
    {
      title: "Programming with python ",
      author: "Douglas chris",
      likes: 5
    },
    {
      title: "Electricity generation ",
      author: "Douglas chris",
      likes: 12
    },
    {
      title: "Full stack open ",
      author: "Boluwatife Oguns",
      likes: 10
    },
    {
      title: "The effects of negotiations ",
      author: "Boluwatife Oguns",
      likes: 0
    },
    {
      title: "Kiode",
      author: "Boluwatife Oguns",
      likes: 2
    }
  ]

  test('returns author with most total likes', () => {
    const result = mostLikes(blogs)

    expect(result).toEqual({
      author: "Douglas chris",
      likes: 17
    })
  })
})