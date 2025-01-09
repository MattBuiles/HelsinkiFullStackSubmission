const ErrorMessage = ({ message }) => {

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }


  if (message === null) {
    return null
  }
  return (
    <div style={errorStyle} className="error">
      {message}
    </div>
  )
}

export default ErrorMessage