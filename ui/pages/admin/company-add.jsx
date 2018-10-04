import React from 'react'
import Helmet from 'react-helmet'
import Joi from 'joi'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import RoleChecker from '../../components/role-checker.jsx'
import { requestAdminCreateCompany } from '../../../redux/actions/admin/company'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { Form, Input, TextArea, MultiInput, Image } from '../../components/form-components'

const schema = {
  name: Joi.string().required().label('Company Name'),
  numberEmployees: Joi.number().integer().required().label('Number of People in Company'),
  description: Joi.string().empty('').label('Description'),
  locations: Joi.array().items(Joi.string().required()).required(),
  departments: Joi.array().items(Joi.string().required()).required(),
  logo: Joi.string().uri().empty('').default('')
}

const AdminCompanyAdd = React.createClass({
  getInitialState () {
    return { logo: '' }
  },
  propTypes: {
    requestAdminCreateCompany: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired
  },
  addCompany (err, company) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }

    this.props.requestAdminCreateCompany(company)
      .then(() => {
        this.props.addPopTartMsg({message: 'Company added', level: 'success'})
        browserHistory.push('/admin/companies')
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  render () {
    const uploadcareOptions = {
      imagesOnly: true,
      previewStep: true
    }
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'admin-company-new-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <h1>Create Company</h1>
            <Form onSubmit={this.addCompany} schema={schema}>
              <Input name='name' label='Company Name' />
              <Input name='numberEmployees' label='Number of People in Company' />
              <TextArea name='description' label='Description' />
              <MultiInput name='locations' label='Locations' />
              <MultiInput name='departments' label='Departments' />
              <Image name='logo' label='Logo' opts={uploadcareOptions} />
              <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
            </Form>
            <hr />
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToProps = { requestAdminCreateCompany, addPopTartMsg }

const AdminCompanyAddContainer = connect(null, mapDispatchToProps)(AdminCompanyAdd)

export default React.createClass({
  render () {
    return (
      <RoleChecker role='admin'>
        <AdminCompanyAddContainer />
      </RoleChecker>
    )
  }
})
