import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (id, object) => {
  const response = await axios.put(`${baseUrl}/${id}`, object)
  return response.data
}

const voteAnecdote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const updatedAnecdote = { ...response.data, votes: response.data.votes + 1 }
  const updatedResponse = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return updatedResponse.data
}

export default { getAll, createNew, update, voteAnecdote }