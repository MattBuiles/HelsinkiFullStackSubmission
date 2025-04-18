import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setTimedNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target[0].value
    event.target[0].value = ''
    dispatch(createAnecdote(content))
    dispatch(setTimedNotification(`you created '${content}'`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm