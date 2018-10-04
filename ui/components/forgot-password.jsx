import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Joi from 'joi'
import { Form, Input } from './form-components'
import { requestUserPasswordForgot } from '../../redux/actions/user-password'
import { addPopTartMsg } from '../../redux/actions/popmsgs'

const schema = { email: Joi.string().email().required() }

class ForgotPassword extends Component {
  static propTypes = {
    onLoginClick: PropTypes.func,
    onForgotPasswordSuccess: PropTypes.func,
    requestUserPasswordForgot: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired
  }

  state = { email: '', submitting: false }

  onSubmit = (err, { email }) => {
    if (err) {
      console.warn('Form validation error', err)
      const message = err.details[0].message
      return this.props.addPopTartMsg({ message, level: 'error' })
    }

    this.setState({ submitting: true })

    this.props.requestUserPasswordForgot(email)
      .then(() => {
        this.setState({ submitting: false })

        this.props.addPopTartMsg({
          level: 'success',
          message: 'An email to reset your password has been sent to you'
        })

        if (this.props.onForgotPasswordSuccess) {
          this.props.onForgotPasswordSuccess()
        }
      })
      .catch((err) => {
        this.setState({ submitting: false })
        console.error(err)
        this.props.addPopTartMsg({ message: err.message, level: 'error' })
      })
  }

  render () {
    return (
      <div className='forgot-password-component'>
        <Form schema={schema} onSubmit={this.onSubmit}>
          <Input type='email' label='Enter your email to request a password reset email' name='email' placeholder='Email address' />
          <div className='row'>
            <div className='col-sm-6'>
              <p><button type='submit' className='btn btn-info' disabled={this.state.submitting}>Submit</button></p>
            </div>
            <div className='col-sm-6'>
              {this.renderLoginLink()}
            </div>
          </div>
        </Form>
      </div>
    )
  }

  renderLoginLink () {
    if (this.props.onLoginClick) {
      return (
        <button type='button' onClick={this.props.onLoginClick} className='btn btn-link white pull-sm-right'>Back to login</button>
      )
    } else {
      return (
        <Link to='login' className='btn btn-link white pull-sm-right'>Back to login</Link>
      )
    }
  }
}

const mapDispatchToProps = { requestUserPasswordForgot, addPopTartMsg }

export default connect(null, mapDispatchToProps)(ForgotPassword)
