import React from 'react'
import { connect } from 'react-redux'
import Joi from 'joi'
import pick from 'lodash.pick'
import { Form, Input, DatePicker, Select } from '../../components/form-components'
import { requestUpdateUser } from '../../../redux/actions/user'

const statisticsSchema = {
  height: Joi.number().min(50).required(),
  weight: Joi.number().min(0).required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  dob: Joi.date().max('now').required()
}

const VitalStats = React.createClass({
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
    const { user } = this.props
    const statsDefaults = pick(user, [
      'height',
      'weight',
      'gender',
      'dob'
    ])

    return (
      <section className='panel panel-default'>
        <div className='panel-body p-x-3'>
          <div className='text-center'>
            <img src='/imgs/icon-152x152.png' className='d-inline-block' width='100' />
          </div>
          <p className='lead m-t-3'>
            Finally, we need you to provide some personal data, which is also used in the calculation of KudosPoints.
          </p>
          <p>This data will <strong>not</strong> be disclosed publicly.</p>
          <Form onSubmit={updateUser} schema={statisticsSchema} defaults={statsDefaults} onValidate={onValidate} className='m-t-3'>
            <Input type='number' name='height' label='Height (cm)' step={0.1} />
            <Input type='number' name='weight' label='Weight (kg)' step={0.1} />
            <Select name='gender' label='Gender' options={['Male', 'Female', 'Other']} />
            <DatePicker type='number' name='dob' label='Date of birth' dateFormat='DD/MM/YYYY' />
            <div className='text-center m-t-3'><button type='submit' className='btn btn-warning btn-lg' disabled={!this.state.isValid}>Done</button></div>
          </Form>
        </div>
      </section>
    )
  }
})

const addDispatchToProps = { requestUpdateUser }

export default connect(null, addDispatchToProps)(VitalStats)
