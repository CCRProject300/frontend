import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import RoleChecker from '../../components/role-checker.jsx'
import UserAutocomplete from '../../components/user-autocomplete.jsx'
import { browserHistory } from 'react-router'
import { requestSearchUsers } from '../../../redux/actions/search-users'
import { requestCreateCompanyMembers } from '../../../redux/actions/company-members'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const CompanyMembersAdd = React.createClass({
  propTypes: {
    requestSearchUsers: React.PropTypes.func.isRequired,
    requestCreateCompanyMembers: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      companyId: React.PropTypes.string.isRequired
    }).isRequired
  },
  getInitialState () {
    return {
      users: []
    }
  },
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
  addUsersToCompany (evt) {
    evt.preventDefault()

    const companyId = this.props.params.companyId
    const payload = this.state.users.map((u) => u._id)

    this.props.requestCreateCompanyMembers({ companyId, payload })
      .then(() => {
        this.props.addPopTartMsg({message: 'Members(s) added', level: 'success'})
        browserHistory.push(`/company/${encodeURIComponent(companyId)}/members`)
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },
  render () {
    const { users } = this.state
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'moderate-leaderboard-members-add' }} />
        <div>
          <h1>Add Employees</h1>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <UserAutocomplete onClick={this.addMatchToUsers} />
          </div>
          <div className='col-md-6'>
            {users.length ? (
              <div className='list-group' id='user-list'>
                {users.map((user, ind) => {
                  return (
                    <a href='#' key={ind} className='list-group-item' onClick={this.removeUser.bind(this, user)}>
                      {user.firstName} {user.lastName}
                      <i className='fa fa-trash-o pull-right'></i>
                    </a>
                  )
                })}
              </div>
            ) : null}
            <button type='button' className='btn btn-info pull-right add-group' onClick={this.addUsersToCompany}>Add Employees</button>
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToProps = {
  requestSearchUsers,
  requestCreateCompanyMembers,
  addPopTartMsg
}

const CompanyMembersAddContainer = connect(null, mapDispatchToProps)(CompanyMembersAdd)

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <CompanyMembersAddContainer {...props} />
    </RoleChecker>
  )
}
