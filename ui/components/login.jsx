import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ForgotPassword from './forgot-password.jsx'
import { requestLogin } from '../../redux/actions/user'
import { addPopTartMsg } from '../../redux/actions/popmsgs'
import Joi from 'joi'
import { Form, Input } from './form-components'

const schema = {
  email: Joi.string().email().required().label('email'),
  password: Joi.string().required().label('password')
}

class Login extends Component {
  static propTypes = {
    onRegisterClick: PropTypes.func,
    requestLogin: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired
  }

  state = { email: '', password: '', showForgotPassword: false }

  onRegisterClick = (e) => {
    if (this.props.onRegisterClick) {
      this.props.onRegisterClick(e)
    }
  }

  onLoginClick = (e) => {
    e.preventDefault()
    this.setState({ showForgotPassword: false })
  }

  onForgotClick = (e) => {
    e.preventDefault()
    this.setState({ showForgotPassword: true })
  }

  onForgotPasswordSuccess = () => this.setState({ showForgotPassword: false })

  onSubmit = (err, payload) => {
    if (err) return this.props.addPopTartMsg({message: err.details[0].message, level: 'error', position: 'tc'})
    this.props.requestLogin(payload)
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error', position: 'tc'})
      })
  }

  render () {
    return (
      <div>
        <ul className='nav nav-tabs nav-justified'>
          <li role='presentation' className='active'><a href='#' className='white'>Login</a></li>
          <li role='presentation'><a href='#' className='white' onClick={this.onRegisterClick}>Register</a></li>
        </ul>
        <div className='bg-primary p-a-3'>
          {this.renderLoginOrForgotPassword()}
        </div>
      </div>
    )
  }

  renderLoginOrForgotPassword () {
    if (this.state.showForgotPassword) {
      return (
        <ForgotPassword onLoginClick={this.onLoginClick} onForgotPasswordSuccess={this.onForgotPasswordSuccess} />
      )
    } else {
      return (
        <Form action='/login' method='post' schema={schema} onSubmit={this.onSubmit} >
          <Input label='Email address' name='email' type='email' placeholder='username@example.com' />
          <Input label='Password' name='password' type='password' />
          <div className='row'>
            <div className='col-sm-6'>
              <p><button type='submit' className='btn btn-info'>Login</button></p>
            </div>
            <div className='col-sm-6'>
              <a href='#' onClick={this.onForgotClick} className='btn btn-link white pull-sm-right'>Forgotten your password?</a>
            </div>
          </div>
        </Form>
      )
    }
  }
}

const mapDispatchToProps = { requestLogin, addPopTartMsg }

export default connect(null, mapDispatchToProps)(Login)
