import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Joi from 'joi'
import { requestCreateLeague } from '../../redux/actions/league'
import { addPopTartMsg } from '../../redux/actions/popmsgs'
import { Form, Input, TextArea, DatePicker } from '../components/form-components'

const schema = {
  name: Joi.string().required().label('League Name'),
  description: Joi.string().empty('').label('Description'),
  startDate: Joi.date().iso().empty(null).label('Start Date'),
  endDate: Joi.date().iso().empty(null).min(Joi.ref('startDate')).label('End Date')
}

const LeagueAdd = React.createClass({
  propTypes: {
    requestCreateLeague: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired
  },
  submitLeague (err, payload) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }

    this.props.requestCreateLeague(payload)
      .then(() => {
        this.props.addPopTartMsg({message: 'League added', level: 'success'})
        browserHistory.push('/leagues')
      })
      .catch((err) => {
        const message = err.message || 'Failed to add league'
        this.props.addPopTartMsg({message, level: 'error'})
      })
  },
  render () {
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'user-add-league-page' }} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <h1>Create League</h1>
            <Form onSubmit={this.submitLeague} schema={schema}>
              <Input name='name' label='League Name' />
              <TextArea name='description' label='Description' />
              <DatePicker name='startDate' label='Start Date' dateFormat='DD/MM/YYYY' />
              <DatePicker name='endDate' label='End Date' dateFormat='DD/MM/YYYY' />
              <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
            </Form>
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToProps = { requestCreateLeague, addPopTartMsg }

export default connect(null, mapDispatchToProps)(LeagueAdd)
