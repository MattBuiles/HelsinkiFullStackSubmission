const LoginForm = ({ 
  handleLogin, 
  username, 
  handleUsernameChange, 
  password, 
  handlePasswordChange, 
}) => {
  return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" onChange={handleLogin}>login
        </button>
      </form>
  )
}

export default LoginForm