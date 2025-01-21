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

  if (message.includes('Wrong') || message.includes('Error') || message.includes('invalid')) {
    notificationStyle.color = 'red'
  }

  return (
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  )
}

export default Notification