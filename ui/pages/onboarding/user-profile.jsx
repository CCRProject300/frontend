import React from 'react'
import { connect } from 'react-redux'
import Joi from 'joi'
import pick from 'lodash.pick'
import { Form, Image, Select } from '../../components/form-components'
import { requestUpdateUser } from '../../../redux/actions/user'

const userSchema = {
  avatar: Joi.string().uri().label('Avatar url')
}

const departmentSchema = {
  department: Joi.string().label('Department').min(1).required()
}

const locationSchema = {
  location: Joi.string().label('Location').min(1).required()
}

const uploadcareOptions = {
  imagesOnly: true,
  previewStep: true
}

const NoImageComponent = ({ onClick }) => (
  <div className='text-center'>
    <img src='https://www.gravatar.com/avatar?d=mm&s=200' className='d-inline-block' onClick={onClick} style={{ cursor: 'pointer' }} />
  </div>
)

const UserProfile = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    company: React.PropTypes.object
  },

  getDefaultProps () {
    return { company: {} }
  },

  getInitialState () {
    return { isValid: false }
  },

  updateUser (err, payload) {
    const { onUpdateUser = () => {}, requestUpdateUser } = this.props
    if (err) return onUpdateUser(Promise.reject(err))
    onUpdateUser(requestUpdateUser(payload))
  },

  onValidate (err) {
    const isValid = !err
    if (isValid !== this.state.isValid) this.setState({ isValid })
  },

  render () {
    const { updateUser, onValidate } = this
    const { user, company } = this.props

    const profileDefaults = pick(user, [
      'avatar',
      'department',
      'location'
    ])

    const schema = {...userSchema}
    const hasDepartments = !!(company.departments && company.departments.length)
    const hasLocations = !!(company.locations && company.locations.length)
    if (hasDepartments) Object.assign(schema, departmentSchema)
    if (hasLocations) Object.assign(schema, locationSchema)

    return (
      <section className='panel panel-default'>
        <div className='panel-body p-x-3'>
          <div className='text-center'>
            <img src='/imgs/icon-152x152.png' className='d-inline-block' width='100' />
          </div>
          <p className='lead m-t-3'>
            To get started, upload an picture you'd like to use as your profile picture.
          </p>
          <Form onSubmit={updateUser} schema={schema} defaults={profileDefaults} onValidate={onValidate} className='m-t-3'>
            <Image name='avatar' opts={uploadcareOptions} noImageComponent={NoImageComponent} />
            {(hasLocations || hasDepartments)
              ? <p className='m-t-3 m-b-2'>You also need to confirm some details about your role in the company.</p>
              : null
            }
            {hasDepartments ? <Select name='department' label='Department' options={company.departments} /> : null}
            {hasLocations ? <Select name='location' label='Location' options={company.locations} /> : null}
            <div className='text-center m-t-3'><button type='submit' className='btn btn-warning btn-lg' disabled={!this.state.isValid}>Next</button></div>
          </Form>
        </div>
      </section>
    )
  }
})

const addDispatchToProps = { requestUpdateUser }

export default connect(null, addDispatchToProps)(UserProfile)
