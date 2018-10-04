import React from 'react'
import { connect } from 'react-redux'
import { requestRegister } from '../../redux/actions/user'
import { addPopTartMsg } from '../../redux/actions/popmsgs'
import Joi from 'joi'
import { Form, Input } from './form-components'

const schema = {
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password')
}

const Login = React.createClass({
  propTypes: {
    onRegisterClick: React.PropTypes.func,
    requestRegister: React.PropTypes.func.isRequired,
    onLoginClick: React.PropTypes.func,
    addPopTartMsg: React.PropTypes.func,
    company: React.PropTypes.object,
    token: React.PropTypes.string
  },

  getInitialState () {
    return Object.keys(schema).reduce(function (state, key) {
      state[key] = ''
      return state
    }, {})
  },

  onLoginClick (e) {
    if (this.props.onLoginClick) {
      this.props.onLoginClick(e)
    }
  },

  onSubmit (err, payload) {
    const token = this.props.token
    if (err) return this.props.addPopTartMsg({message: err.details[0].message, level: 'error', position: 'tc'})
    this.props.requestRegister(payload, token)
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error', position: 'tc'})
      })
  },

  render () {
    return (
      <div>
        <ul className='nav nav-tabs nav-justified'>
          <li role='presentation' ><a href='#' className='white' onClick={this.onLoginClick}>Login</a></li>
          <li role='presentation' className='active'><a href='#' className='white'>Register</a></li>
        </ul>
        <div className='bg-primary p-a-3'>
          {this.props.company ? this.renderCompany(this.props.company) : ''}
          <p className='m-x-auto p-b-2' style={{maxWidth: 250}}>Join KudosHealth for Free. We make health fun &amp; rewarding for everyone.</p>
          <Form onSubmit={this.onSubmit} schema={schema}>
            <Input name='firstName' type='text' placeholder='First Name' />
            <Input name='lastName' type='text' placeholder='Last Name' />
            {this.props.company
              ? <div className='form-group'><input className='form-control' name='companyName' type='text' readOnly value={this.props.company.name} /></div>
              : ''
            }
            <Input name='email' type='email' placeholder='Email' />
            <Input name='password' type='password' placeholder='Password' />
            <button type='submit' className='btn btn-info'>Signup</button>
          </Form>
        </div>
      </div>
    )
  },

  renderCompany (company) {
    return (
      <div className='m-b-1'>
        <img src={company.logo} style={{ maxWidth: '150px', maxHeight: '100px' }} />
      </div>
    )
  }
})

const mapDispatchToProps = { requestRegister, addPopTartMsg }

export default connect(null, mapDispatchToProps)(Login)
