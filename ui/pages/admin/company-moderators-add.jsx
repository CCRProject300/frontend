import React from 'react'
import Helmet from 'react-helmet'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { requestSearchUsers } from '../../../redux/actions/search-users'
import { requestAdminCreateCompanyModerators } from '../../../redux/actions/admin/company-moderators'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import RoleChecker from '../../components/role-checker.jsx'

const AdminCompanyModeratorsAdd = React.createClass({
  propTypes: {
    requestSearchUsers: React.PropTypes.func.isRequired,
    requestAdminCreateCompanyModerators: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      companyId: React.PropTypes.string.isRequired
    }).isRequired
  },
  getInitialState () {
    return {
      matches: [],
      users: [],
      searchTerm: ''
    }
  },
  changeSearchTerm (evt) {
    this.setState({ searchTerm: evt.target.value }, this.getMatches)
  },
  getMatches: debounce(function () {
    this.props.requestSearchUsers({ q: this.state.searchTerm })
      .then((matches) => this.setState({ matches }))
  }, 1000),
  addMatchToUsers (user) {
    let users = Array.from(this.state.users)
    if (!users.some((u) => u._id === user._id)) {
      users.push(user)
      this.setState({ users })
    }
  },
  removeUser (user) {
    let users = Array.from(this.state.users).filter((u) => u._id !== user._id)
    this.setState({ users })
  },
  addUsersToGroup (evt) {
    evt.preventDefault()

    const companyId = this.props.params.companyId
    const payload = this.state.users.map((u) => u._id)

    this.props.requestAdminCreateCompanyModerators({ companyId, payload })
      .then(() => {
        this.props.addPopTartMsg({message: 'Moderator(s) added', level: 'success'})
        browserHistory.push(`/admin/company/${encodeURIComponent(companyId)}/moderators`)
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  render () {
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'admin-moderator-add-page'}} />
        <div>
          <h1>Add Moderators</h1>
        </div>
        <div className='col-md-6'>
          <input type='text' name='searchTerm' placeholder='Add moderators by name, username or email' value={this.state.searchTerm} onChange={this.changeSearchTerm} />
          <div className='list-group' id='result'>
            {this.state.matches.map((user, ind) => {
              return (
                <a href='#' key={ind} className='list-group-item' onClick={this.addMatchToUsers.bind(this, user)}>
                  {user.firstName} {user.lastName} <i className='fa fa-plus-square-o'></i>
                </a>
              )
            })}
          </div>
        </div>
        <div className='col-md-6'>
          <div className='list-group' id='user-list'>
            {this.state.users.map((user, ind) => {
              return (
                <a href='#' key={ind} className='list-group-item' onClick={this.removeUser.bind(this, user)}>
                  {user.firstName} {user.lastName} <i className='fa fa-trash-o pull-right'></i>
                </a>
              )
            })}
          </div>
        </div>
        <button type='button' className='btn btn-info pull-right add-group' onClick={this.addUsersToGroup}>Add moderators to company</button>
      </section>
    )
  }
})

const mapDispatchToProps = {
  requestSearchUsers,
  requestAdminCreateCompanyModerators,
  addPopTartMsg
}

const AdminCompanyModeratorsAddContainer = connect(null, mapDispatchToProps)(AdminCompanyModeratorsAdd)

export default function (props) {
  return (
    <RoleChecker role='admin'>
      <AdminCompanyModeratorsAddContainer {...props} />
    </RoleChecker>
  )
}
