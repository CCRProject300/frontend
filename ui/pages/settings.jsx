import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Device from '../components/device.jsx'
import Joi from 'joi'
import pick from 'lodash.pick'
import { Form, Input, Image, Select, DatePicker, Toggle } from '../components/form-components'
import { requestUpdateUser } from '../../redux/actions/user'
import { addPopTartMsg } from '../../redux/actions/popmsgs'

const userSchema = {
  firstName: Joi.string().required().label('First name'),
  lastName: Joi.string().required().label('Last name'),
  email: Joi.string().email().required().label('Email'),
  avatar: Joi.string().uri().label('Avatar url'),
  department: Joi.string().label('Department'),
  location: Joi.string().label('Location')
}

const passwordSchema = {
  password: Joi.string().required().label('Password'),
  passwordConfirm: Joi.string().valid(Joi.ref('password')).required().label('Password confirmation')
}

const statisticsSchema = {
  height: Joi.number().min(50),
  weight: Joi.number().min(0),
  gender: Joi.string().valid('Male', 'Female'),
  dob: Joi.date()
}

const emailPreferencesSchema = {
  league: Joi.boolean(),
  podium: Joi.boolean(),
  leaderboard: Joi.boolean(),
  connected: Joi.boolean()
}

const Settings = React.createClass({
  updateUser (err, payload) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }

    this.props.requestUpdateUser(payload)
      .then(() => {
        this.props.addPopTartMsg({message: 'Profile updated', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  updatePassword (err, { password }, reset) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }

    this.props.requestUpdateUser({ password })
      .then(() => {
        this.props.addPopTartMsg({message: 'Password updated', level: 'success'})
        reset()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  updateEmailPreferences (err, emailPreferences) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }
    this.props.requestUpdateUser({ emailPreferences })
      .then(() => {
        this.props.addPopTartMsg({message: 'Email notifications updated', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  render () {
    const profileDefaults = pick(this.props.user, [
      'firstName',
      'lastName',
      'email',
      'avatar',
      'department',
      'location'
    ])
    const statsDefaults = pick(this.props.user, [
      'height',
      'weight',
      'gender',
      'dob'
    ])
    const emailPreferencesDefaults = pick(this.props.user, [
      'emailPreferences'
    ])
    const uploadcareOptions = {
      imagesOnly: true,
      previewStep: true
    }
    const company = (this.props.companies && this.props.companies[0]) || {}
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'settings-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-md-5 col-md-offset-1'>
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Profile</h1>
              </div>
              <div className='panel-body'>
                <Form onSubmit={this.updateUser} schema={userSchema} defaults={profileDefaults}>
                  <Input name='firstName' label='First Name' />
                  <Input name='lastName' label='Last Name' />
                  <Input name='email' label='Email' />
                  <Image name='avatar' label='Avatar' opts={uploadcareOptions} />
                  <Select name='department' label='Department' options={company.departments} />
                  <Select name='location' label='Location' options={company.locations} />
                  <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
                </Form>
              </div>
            </section>
            <hr />
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Password</h1>
              </div>
              <div className='panel-body'>
                <Form onSubmit={this.updatePassword} schema={passwordSchema}>
                  <Input type='password' name='password' label='New Password' />
                  <Input type='password' name='passwordConfirm' label='Confirm New Password' />
                  <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
                </Form>
              </div>
            </section>
          </div>
          <div className='col-sm-6 col-md-5'>
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Individual Statistics</h1>
              </div>
              <div className='panel-body'>
                <p className='text-muted'>These are required to calculate your kudos points, but will not be disclosed publicly.</p>
                <Form onSubmit={this.updateUser} schema={statisticsSchema} defaults={statsDefaults}>
                  <Input type='number' name='height' label='Height (cm)' step={0.1} />
                  <Input type='number' name='weight' label='Weight (kg)' step={0.1} />
                  <Select name='gender' label='Gender' options={['Male', 'Female', 'Other']} />
                  <DatePicker type='number' name='dob' label='Date of birth' dateFormat='DD/MM/YYYY' />
                  <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
                </Form>
              </div>
            </section>
            <hr />
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Connected Apps</h1>
              </div>
              <div className='panel-body text-left'>
                <Device user={this.props.user} app='fitbit' />
                <Device user={this.props.user} app='google-fit' />
                <Device user={this.props.user} app='runkeeper' />
                <Device user={this.props.user} app='strava' />
              </div>
            </section>
            <hr />
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Email Notifications</h1>
              </div>
              <div className='panel-body text-left'>
                <Form onSubmit={this.updateEmailPreferences} schema={emailPreferencesSchema} defaults={emailPreferencesDefaults.emailPreferences}>
                  <Toggle name='league' label='When added to a league' />
                  <Toggle name='podium' label='Weekly podium winners' />
                  <Toggle name='leaderboard' label='Place change in a leaderboard' />
                  <Toggle name='connected' label='Remind me to connect a device' />
                  <button type='submit' className='m-t-1 btn btn-warning btn-lg'>Submit</button>
                </Form>
              </div>
            </section>
          </div>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ user, companies }) => ({ user, companies })
const mapDispatchToProps = { requestUpdateUser, addPopTartMsg }

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
