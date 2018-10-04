import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment-timezone'
import RoleChecker from '../../components/role-checker.jsx'
import { requestAdminCompanies } from '../../../redux/actions/companies'
import { requestModerators, requestDeleteModerator } from '../../../redux/actions/moderators'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const CompanyModerators = React.createClass({
  removeModerator (userId) {
    if (!window.confirm('Are you sure you want to delete this moderator?')) return
    this.props.requestDeleteModerator(this.props.params.companyId, userId)
      .then(() => {
        this.props.addPopTartMsg({message: 'Moderator deleted', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  componentDidMount () {
    this.props.requestAdminCompanies()
    this.props.requestModerators(this.props.params.companyId)
  },
  render () {
    const company = this.props.companies.find((c) => c._id === this.props.params.companyId) || {}
    const moderators = this.props.moderators || []
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'admin-company-manage-page'}} />
        <div>
          <div className='float-left' style={{ paddingRight: '30px' }}>
            <h5 style={{ fontWeight: 'bold' }}>Company</h5>{company.name}
          </div>
          <div className='float-left' style={{ paddingRight: '30px' }}>
            <h5 style={{ fontWeight: 'bold' }}>Description</h5>{company.description}
          </div>
        </div>
        <div style={{ clear: 'both' }}></div>
        <div>
          <Link to={`/admin/company/${company._id}/moderators/add`}>
            <h3>
              <i className='fa fa-plus-square-o'></i> Add Moderators
            </h3>
          </Link>
        </div>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr className='top-leaderboard'>
                <th>Name</th>
                <th>Activated</th>
                <th>Start Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {moderators.map((moderator, ind) => {
                return (
                  <tr className='leaderboard-user' key={ind}>
                    <td>{moderator.firstName} {moderator.lastName}</td>
                    <td>{moderator.activated ? 'true' : 'false'}</td>
                    <td>
                      {(moderator.startDate && moment(moderator.startDate).isValid())
                        ? moment.tz(moderator.startDate, this.props.user.timezone).format(this.props.config.dateFormat)
                        : 'Not activated'}
                    </td>
                    <td>
                      <button type='button' className='btn btn-danger pull-right remove-user' onClick={this.removeModerator.bind(this, moderator._id)}>
                        <i className='fa fa-trash-o'></i>
                      </button>
                    </td>
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

const mapStateToProps = ({ user, companies, moderators, config }) => ({ user, companies, moderators, config })
const mapDispatchToProps = { requestAdminCompanies, requestModerators, requestDeleteModerator, addPopTartMsg }

const CompanyModeratorsContainer = connect(mapStateToProps, mapDispatchToProps)(CompanyModerators)

export default function (props) {
  return (
    <RoleChecker role='admin'>
      <CompanyModeratorsContainer {...props} />
    </RoleChecker>
  )
}
