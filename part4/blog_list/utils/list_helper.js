const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  const topAuthor = Object.entries(blogCounts).reduce((max, [author, count]) => {
    return count > (max?.blogs || 0) ? { author, blogs: count } : max
  }, null)

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const likeCounts = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})

  const topAuthor = Object.entries(likeCounts).reduce((max, [author, likes]) => {
    return likes > (max?.likes || 0) ? { author, likes } : max
  }, null)

  return topAuthor
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
