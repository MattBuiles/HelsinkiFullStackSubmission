import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, handleUsernameChange, password, handlePasswordChange }) => (
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">username</label>
      <input
        id="username"
        type="text"
        value={username}
        name="username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        value={password}
        name="password"
        onChange={handlePasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm