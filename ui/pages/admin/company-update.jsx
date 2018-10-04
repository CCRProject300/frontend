import React from 'react'
import Helmet from 'react-helmet'
import Joi from 'joi'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import pick from 'lodash.pick'
import RoleChecker from '../../components/role-checker.jsx'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { Form, Input, TextArea, Image } from '../../components/form-components'
import EditTags from '../../components/edit-tags.jsx'
import {
  requestAdminCompany,
  requestAdminUpdateCompany
} from '../../../redux/actions/admin/company'
import {
  requestAdminUpdateCompanyLocation,
  requestAdminCreateCompanyLocation,
  requestAdminDeleteCompanyLocation
} from '../../../redux/actions/admin/company-locations'
import {
  requestAdminCreateCompanyDepartment,
  requestAdminUpdateCompanyDepartment,
  requestAdminDeleteCompanyDepartment
} from '../../../redux/actions/admin/company-departments'

const schema = {
  _id: Joi.string(),
  name: Joi.string().min(2).label('Company Name'),
  numberEmployees: Joi.number().integer().label('Number of People in Company'),
  description: Joi.string().empty('').label('Description'),
  logo: Joi.string().uri().empty(''),
  locations: Joi.array(),
  departments: Joi.array(),
  deleted: Joi.boolean()
}

const AdminCompanyUpdate = React.createClass({
  propTypes: {
    requestAdminCompany: React.PropTypes.func.isRequired,
    requestAdminUpdateCompany: React.PropTypes.func.isRequired,
    requestAdminCreateCompanyLocation: React.PropTypes.func.isRequired,
    requestAdminUpdateCompanyLocation: React.PropTypes.func.isRequired,
    requestAdminDeleteCompanyLocation: React.PropTypes.func.isRequired,
    requestAdminCreateCompanyDepartment: React.PropTypes.func.isRequired,
    requestAdminUpdateCompanyDepartment: React.PropTypes.func.isRequired,
    requestAdminDeleteCompanyDepartment: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      companyId: React.PropTypes.string.isRequired
    }).isRequired
  },
  getInitialState () {
    return {
      company: null
    }
  },
  fetchCompany () {
    this.props.requestAdminCompany(this.props.params.companyId)
      .then((company) => this.setState({ company }))
      .catch((err) => {
        this.props.addPopTartMsg({ message: err.message, level: 'error' })
      })
  },
  componentWillMount () {
    this.fetchCompany()
  },
  onSubmit (err, payload) {
    if (err) {
      return this.props.addPopTartMsg({
        message: err.details[0].message,
        level: 'error'
      })
    }
    payload = pick(payload, ['name', 'description', 'numberEmployees', 'logo'])
    this.updateCompany(this.props.params.companyId, payload)
  },
  updateCompany (id, payload) {
    this.props.requestAdminUpdateCompany(id, payload)
      .then(() => {
        this.props.addPopTartMsg({message: 'Company updated', level: 'success'})
        browserHistory.push('/admin/companies')
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onCreateLocation (location) {
    this.props.requestAdminCreateCompanyLocation(this.props.params.companyId, location)
      .then(() => {
        this.props.addPopTartMsg({
          message: `Added location ${location}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onUpdateLocation (originalLocation, newLocation) {
    this.props.requestAdminUpdateCompanyLocation(this.props.params.companyId, originalLocation, {location: newLocation})
      .then(() => {
        this.props.addPopTartMsg({
          message: `Renamed location ${originalLocation} to ${newLocation}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onDeleteLocation (location) {
    this.props.requestAdminDeleteCompanyLocation(this.props.params.companyId, location)
      .then(() => {
        this.props.addPopTartMsg({
          message: `Removed location ${location}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onCreateDepartment (department) {
    this.props.requestAdminCreateCompanyDepartment(this.props.params.companyId, department)
      .then(() => {
        this.props.addPopTartMsg({
          message: `Added department ${department}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onUpdateDepartment (originalDepartment, newDepartment) {
    this.props.requestAdminUpdateCompanyDepartment(this.props.params.companyId, originalDepartment, {department: newDepartment})
      .then(() => {
        this.props.addPopTartMsg({
          message: `Renamed department ${originalDepartment} to ${newDepartment}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  onDeleteDepartment (department) {
    this.props.requestAdminDeleteCompanyDepartment(this.props.params.companyId, department)
      .then(() => {
        this.props.addPopTartMsg({
          message: `Removed department ${department}`,
          level: 'success'
        })
        this.fetchCompany()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  render () {
    const {
      onCreateLocation,
      onUpdateLocation,
      onDeleteLocation,
      onCreateDepartment,
      onUpdateDepartment,
      onDeleteDepartment
    } = this
    const uploadcareOptions = {
      imagesOnly: true,
      previewStep: true
    }

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'admin-company-update-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <h1>Update Company</h1>
            {this.state.company && (
              <Form onSubmit={this.onSubmit} schema={schema} defaults={this.state.company}>
                <Input name='name' label='Company Name' />
                <Input name='numberEmployees' label='Number of People in Company' />
                <TextArea name='description' label='Description' />
                <EditTags
                  title='Locations'
                  tags={this.state.company.locations || []}
                  onCreate={onCreateLocation}
                  onUpdate={onUpdateLocation}
                  onDelete={onDeleteLocation}
                />
                <EditTags
                  title='Departments'
                  tags={this.state.company.departments || []}
                  onCreate={onCreateDepartment}
                  onUpdate={onUpdateDepartment}
                  onDelete={onDeleteDepartment}
                />
                <Image name='logo' label='Logo' opts={uploadcareOptions} />
                <button type='submit' className='btn btn-warning btn-lg'>Update</button>
              </Form>
            )}
            <hr />
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToProps = {
  requestAdminCompany,
  requestAdminUpdateCompany,
  addPopTartMsg,
  requestAdminCreateCompanyLocation,
  requestAdminUpdateCompanyLocation,
  requestAdminDeleteCompanyLocation,
  requestAdminCreateCompanyDepartment,
  requestAdminUpdateCompanyDepartment,
  requestAdminDeleteCompanyDepartment
}

const AdminCompanyUpdateContainer = connect(null, mapDispatchToProps)(AdminCompanyUpdate)

export default function (props) {
  return (
    <RoleChecker role='admin'>
      <AdminCompanyUpdateContainer {...props} />
    </RoleChecker>
  )
}
