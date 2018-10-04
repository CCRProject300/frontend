import React from 'react'
import Login from './login.jsx'
import Register from './register.jsx'

const LoginOrRegister = React.createClass({
  propTypes: {
    initialTab: React.PropTypes.string,
    token: React.PropTypes.string,
    company: React.PropTypes.object
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
      return (<Register onLoginClick={this.onLoginClick} token={this.props.token} company={this.props.company} />)
    }
  }
})

export default LoginOrRegister
