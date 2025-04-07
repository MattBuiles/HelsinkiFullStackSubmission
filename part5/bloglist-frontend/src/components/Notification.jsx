import React from 'react'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  let className = 'notification'
  // Si el mensaje contiene palabras de error, cambia el color y añade la clase 'error'
  if (message.includes('Wrong') || message.includes('Error') || message.includes('invalid')) {
    notificationStyle.color = 'red'
    className += ' error'
  } else {
    className += ' success'
  }

  return (
    <div style={notificationStyle} className={className}>
      {message}
    </div>
  )
}

export default Notification