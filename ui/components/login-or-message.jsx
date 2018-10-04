import React from 'react'
import Login from './login.jsx'

const Message = ({ message, onLoginClick }) => {
  return (
    <div>
      <ul className='nav nav-tabs nav-justified'>
        <li role='presentation' ><a href='#' className='white' onClick={onLoginClick}>Login</a></li>
        <li role='presentation' className='active'><a href='#' className='white'>Register</a></li>
      </ul>
      <div className='bg-primary p-a-3'>
        <p>{message}</p>
      </div>
    </div>
  )
}

const LoginOrMessage = React.createClass({
  propTypes: {
    initialTab: React.PropTypes.string,
    message: React.PropTypes.string
  },
  getDefaultProps () {
    return {
      initialTab: 'login'
    }
  },
  getInitialState () {
    return { showLogin: (this.props.initialTab === 'login') }
  },

  onRegisterClick (e) {
    e.preventDefault()
    this.setState({ showLogin: false })
  },

  onLoginClick (e) {
    e.preventDefault()
    this.setState({ showLogin: true })
  },

  render () {
    if (this.state.showLogin) {
      return (<Login onRegisterClick={this.onRegisterClick} />)
    } else {
      return (<Message onLoginClick={this.onLoginClick} message={this.props.message} />)
    }
  }
})

export default LoginOrMessage
