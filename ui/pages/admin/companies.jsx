import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import { Dropdown, MenuItem } from 'react-bootstrap'
import RoleChecker from '../../components/role-checker.jsx'
import { getRoleName, FeatureRoles } from '../../../lib/roles'
import { requestAdminCompanies, requestDeleteCompany } from '../../../redux/actions/companies'
import { requestAdminUpdateCompany } from '../../../redux/actions/admin/company'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const AdminCompanies = React.createClass({
  propTypes: {
    companies: React.PropTypes.array.isRequired,
    requestAdminCompanies: React.PropTypes.func.isRequired,
    requestAdminUpdateCompany: React.PropTypes.func.isRequired,
    requestDeleteCompany: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired
  },

  componentDidMount () {
    this.props.requestAdminCompanies()
      .catch((err) => this.props.addPopTartMsg({message: err.message, level: 'error'}))
  },

  onAddRoleSelect (key, e) {
    e.preventDefault()

    const role = e.currentTarget.getAttribute('data-role')
    const companyId = e.currentTarget.getAttribute('data-company-id')

    if (!window.confirm(`Are you sure you want to add the role "${getRoleName(role)}" to all company employees?`)) return

    const company = this.props.companies.find((c) => c._id === companyId)
    const payload = { roles: company.roles.filter((r) => r !== role).concat(role) }
    const { requestAdminUpdateCompany, addPopTartMsg } = this.props

    requestAdminUpdateCompany(companyId, payload)
      .then(() => addPopTartMsg({message: 'Role added', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  onRemoveRoleClick (e) {
    e.preventDefault()

    const role = e.currentTarget.getAttribute('data-role')
    const companyId = e.currentTarget.getAttribute('data-company-id')

    if (!window.confirm(`Are you sure you want to remove the role "${getRoleName(role)}" from all company employees?`)) return

    const company = this.props.companies.find((c) => c._id === companyId)
    const payload = { roles: company.roles.filter((r) => r !== role) }
    const { requestAdminUpdateCompany, addPopTartMsg } = this.props

    requestAdminUpdateCompany(companyId, payload)
      .then(() => addPopTartMsg({message: 'Role removed', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  onDeleteCompanyClick (e) {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this company?')) return

    const companyId = e.currentTarget.getAttribute('data-company-id')
    const { requestDeleteCompany, addPopTartMsg } = this.props

    requestDeleteCompany(companyId)
      .then(() => addPopTartMsg({message: 'Company deleted', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  render () {
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'admin-companies-page'}} />
        <p className='lead'>
          <span>Manage Companies</span>
          <Link to='/admin/company/add' className='p-l-2'>
            <i className='fa fa-plus-square-o'></i> Create New
          </Link>
        </p>
        <div>

        </div>
        <div className='responsive-table'>
          <table className='table table-condensed table-hover'>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Join Date</th>
                <th>Role(s)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.companies.map((company, ind) => {
                return (
                  <tr className='leaderboard-league' key={ind}>
                    <td>
                      {company.deleted ? (
                        <strong style={{opacity: '.5'}}>
                          {company.name}
                        </strong>
                      ) : (
                        <strong>
                          <Link to={`/admin/company/${company._id}/moderators`} role='button'>{company.name}</Link>
                        </strong>
                      )}
                    </td>
                    <td>
                      {moment(company.startDate).format(this.props.config.dateFormat)}
                    </td>
                    <td>
                      {company.roles.map((role) => {
                        const labelName = getRoleName(role)

                        return (
                          <span key={company._id + role} className='label label-primary' style={{ marginRight: '5px' }}>
                            <span>{labelName}</span>
                            {company.deleted ? null : (
                              <a
                                href='#'
                                className='white'
                                style={{ marginLeft: '5px' }}
                                title={`Remove role "${labelName}"`}
                                onClick={this.onRemoveRoleClick}
                                data-role={role}
                                data-company-id={company._id}>
                                <i className='fa fa-times' />
                              </a>
                            )}
                          </span>
                        )
                      })}
                    </td>
                    {company.deleted ? <td /> : (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`/admin/company/${company._id}`} title={`Edit ${company.name}`} role='button' className='btn btn-xs btn-warning m-r-1'>
                          Edit
                        </Link>
                        <Dropdown id={`${company._id}-add-role-dropdown`} onSelect={this.onAddRoleSelect}>
                          <Dropdown.Toggle useAnchor className='btn btn-xs btn-warning m-r-1'>
                            Add Role
                          </Dropdown.Toggle>
                          <Dropdown.Menu className='extended'>
                            {FeatureRoles.map((role) => (
                              <MenuItem key={role} data-role={role} data-company-id={company._id} disabled={company.roles.includes(role)}>
                                {getRoleName(role)}
                              </MenuItem>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        <button title={`Delete ${company.name}`} type='button' className='btn btn-xs btn-danger' onClick={this.onDeleteCompanyClick} data-company-id={company._id}>
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ companies, config }) => ({ companies, config })
const mapDispatchToProps = { requestAdminCompanies, requestAdminUpdateCompany, requestDeleteCompany, addPopTartMsg }
const AdminCompaniesContainer = connect(mapStateToProps, mapDispatchToProps)(AdminCompanies)

export default React.createClass({
  render () {
    return (
      <RoleChecker role='admin'>
        <AdminCompaniesContainer {...this.props} />
      </RoleChecker>
    )
  }
})
