import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={good + neutral + bad} />
          <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text='positive' value={(good / (good + neutral + bad)) * 100 + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Give_feedback = ({handle_good, handle_neutral, handle_bad}) => {
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handle_good} text='good' />
      <Button onClick={handle_neutral} text='neutral' />
      <Button onClick={handle_bad} text='bad' />
    </div>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handle_good = () => {
    const newgood = good + 1
    setGood(newgood)
  }

  const handle_neutral = () => {
    const newnewtral = neutral + 1
    setNeutral(newnewtral)
  }

  const handle_bad = () => {
    const newbad = bad + 1
    setBad(newbad)
  }


  return (
    <div>
      <Give_feedback handle_good={handle_good} handle_neutral={handle_neutral} handle_bad={handle_bad} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App