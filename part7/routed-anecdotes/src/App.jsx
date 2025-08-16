import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams,
  useNavigate
} from 'react-router-dom'

// Componente para mostrar notificaciones
const Notification = ({ message }) => {
  if (!message) return null
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb'
  }
  
  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const CreateNew = ({ addNew, setNotification }) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAnecdote = {
      content,
      author,
      info,
      votes: 0
    }
    addNew(newAnecdote)
    
    // Mostrar notificación
    setNotification(`A new anecdote '${content}' created!`)
    
    // Navegar a la página principal
    navigate("/")
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a>.
  </div>
)

const Anecdote = ({anecdotes}) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id))
  
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>For more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  // Limpiar notificación después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('')
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification} />
        
        <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes}/>}/>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
