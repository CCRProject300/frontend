import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Joi from 'joi'
import RoleChecker from '../../components/role-checker.jsx'
import { requestCreatePublicLeague } from '../../../redux/actions/public-league'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { Form, DatePicker, Input, TextArea, Image, Toggle } from '../../components/form-components'

const schema = {
  name: Joi.string().required().label('League Name'),
  description: Joi.string().empty('').label('Description'),
  startDate: Joi.date().iso().empty(null).label('Start Date'),
  endDate: Joi.date().iso().empty(null).min(Joi.ref('startDate')).label('End Date'),
  teamSize: Joi.alternatives(Joi.any().valid(null, ''), Joi.number().min(1)).label('Team Size'),
  minTeamSize: Joi.when('teamSize', {
    is: Joi.any().valid(null, ''),
    then: Joi.number().min(1).required(),
    otherwise: Joi.number().min(1).max(Joi.ref('teamSize')).required()
  }).label('Minimum Team Size'),
  branding: Joi.object().keys({
    logo: Joi.string().uri().required(),
    heroImage: Joi.string().uri().required(),
    title: Joi.string().required(),
    body: Joi.string().required()
  }),
  // Purely for the UI - will not be sent to the API
  brandedLeague: Joi.boolean()
}

const uploadcareOptions = {
  imagesOnly: true,
  previewStep: true
}

export default function (props) {
  return (
    <div>
      <Helmet htmlAttributes={{ class: 'moderate-add-league-page' }} />
      <RoleChecker role='admin'>
        <section className='wrapper'>
          <PublicLeagueAdd {...props} />
        </section>
      </RoleChecker>
    </div>
  )
}

let PublicLeagueAdd = React.createClass({
  propTypes: {
    requestCreatePublicLeague: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired
  },
  getInitialState () {
    const { teamSize, minTeamSize } = this.getDefaultTeamSizes()
    return { showCategories: !teamSize || teamSize > 1, teamSize, minTeamSize, branding: false }
  },
  getDefaultTeamSizes () {
    return { teamSize: 5, minTeamSize: 3 }
  },
  submitLeague (err, payload) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }
    if (this.state.branding && !payload.branding) {
      return this.props.addPopTartMsg({ message: 'Branding details must be entered to create a branded league', level: 'error' })
    }
    if (!payload.teamSize) payload.teamSize = null
    delete payload.brandedLeague
    if (!this.state.branding) delete payload.branding

    this.props.requestCreatePublicLeague({ payload })
      .then(() => {
        this.props.addPopTartMsg({message: 'League added', level: 'success'})
        browserHistory.push('/admin/leagues')
      })
      .catch((err) => {
        const message = err.message || 'Failed to add league'
        this.props.addPopTartMsg({message, level: 'error'})
      })
  },
  onChange (name, value) {
    switch (name) {
      case 'teamSize':
        this.setState({ teamSize: parseInt(value, 10) })
        break
      case 'brandedLeague':
        this.setState({ branding: value })
        break
    }
  },
  render () {
    const { teamSize } = this.state

    return (
      <section className='wrapper'>
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <h1>Create Public League</h1>
            <Form id='new-league-form' onSubmit={this.submitLeague} onChange={this.onChange} schema={schema} defaults={this.getDefaultTeamSizes()}>
              <Input name='name' label='League Name' />
              <TextArea name='description' label='Description' />
              <DatePicker name='startDate' label='Start Date' dateFormat='DD/MM/YYYY' />
              <DatePicker name='endDate' label='End Date' dateFormat='DD/MM/YYYY' />
              <Input name='teamSize' label='Team Size (leave blank for unlimited)' type='number' min={1} step={1} />
              <Input name='minTeamSize' label='Minimum Size (no points scored until team has this many members)' type='number' min={1} max={teamSize || Infinity} step={1} />
              <Toggle label='Branded league' name='brandedLeague' />
              {this.state.branding ? <Image name='branding.heroImage' label='Hero Image' opts={uploadcareOptions} /> : null}
              {this.state.branding ? <Image name='branding.logo' label='Logo' opts={uploadcareOptions} /> : null}
              {this.state.branding ? <Input name='branding.title' label='Page title' /> : null}
              {this.state.branding ? <TextArea name='branding.body' label='Body text' /> : null}
              <input className='btn btn-warning btn-lg' type='submit' value='Submit' />
            </Form>
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToPropsForDetails = { requestCreatePublicLeague, addPopTartMsg }

PublicLeagueAdd = connect(null, mapDispatchToPropsForDetails)(PublicLeagueAdd)
