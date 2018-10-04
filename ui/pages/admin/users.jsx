import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Dropdown, MenuItem } from 'react-bootstrap'
import RoleChecker from '../../components/role-checker.jsx'
import { getRoleName, FeatureRoles } from '../../../lib/roles'
import { requestAdminUpdateUser, requestAdminDeleteUser } from '../../../redux/actions/admin/user'
import { requestAdminUsers } from '../../../redux/actions/admin/users'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const AdminUsers = React.createClass({
  propTypes: {
    adminUsers: React.PropTypes.array.isRequired,
    requestAdminUsers: React.PropTypes.func.isRequired,
    requestAdminDeleteUser: React.PropTypes.func.isRequired,
    requestAdminUpdateUser: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired
  },

  componentDidMount () {
    this.props.requestAdminUsers()
  },

  onDeleteUserClick (e) {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this user?')) return

    const userId = e.currentTarget.getAttribute('data-user-id')
    const { requestAdminDeleteUser, addPopTartMsg } = this.props

    requestAdminDeleteUser(userId)
      .then(() => addPopTartMsg({message: 'User deleted', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  onAddRoleSelect (key, e) {
    e.preventDefault()

    const role = e.currentTarget.getAttribute('data-role')
    const userId = e.currentTarget.getAttribute('data-user-id')

    if (!window.confirm(`Are you sure you want to add the role "${getRoleName(role)}"?`)) return

    const user = this.props.adminUsers.find((u) => u._id === userId)
    const payload = { roles: user.roles.filter((r) => r !== role).concat(role) }
    const { requestAdminUpdateUser, addPopTartMsg } = this.props

    requestAdminUpdateUser({ userId, payload })
      .then(() => addPopTartMsg({message: 'Role added', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  onRemoveRoleClick (e) {
    e.preventDefault()

    const role = e.currentTarget.getAttribute('data-role')
    const userId = e.currentTarget.getAttribute('data-user-id')

    if (!window.confirm(`Are you sure you want to remove the role "${getRoleName(role)}"?`)) return

    const user = this.props.adminUsers.find((u) => u._id === userId)
    const payload = { roles: user.roles.filter((r) => r !== role) }
    const { requestAdminUpdateUser, addPopTartMsg } = this.props

    requestAdminUpdateUser({ userId, payload })
      .then(() => addPopTartMsg({message: 'Role removed', level: 'success'}))
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  },

  renderUser (user) {
    return (
      <tr key={user._id}>
        <td><strong>{`${user.firstName} ${user.lastName}`}</strong></td>
        <td><a href={`mailto:${user.emails[0].address}`}>{user.emails[0].address}</a></td>
        <td>
          {user.roles.map((role) => {
            const labelName = getRoleName(role)

            return (
              <span key={user._id + role} className='label label-primary' style={{ marginRight: '5px' }}>
                <span>{labelName}</span>
                {['corporate_mod', 'user'].includes(role) ? null : (
                  <a
                    href='#'
                    className='white'
                    style={{ marginLeft: '5px' }}
                    title={`Remove role "${labelName}"`}
                    onClick={this.onRemoveRoleClick}
                    data-role={role}
                    data-user-id={user._id}>
                    <i className='fa fa-times' />
                  </a>
                )}
              </span>
            )
          })}
        </td>
        <td style={{ whiteSpace: 'nowrap' }}>
          <Dropdown id={`${user._id}-add-role-dropdown`} onSelect={this.onAddRoleSelect}>
            <Dropdown.Toggle useAnchor className='btn btn-xs btn-warning m-r-1'>
              Add Role
            </Dropdown.Toggle>
            <Dropdown.Menu className='extended'>
              {['admin'].concat(FeatureRoles).map((role) => (
                <MenuItem data-role={role} data-user-id={user._id} disabled={user.roles.includes(role)}>
                  {getRoleName(role)}
                </MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <button
            title={`Delete ${user.firstName} ${user.lastName}`}
            type='button'
            className='btn btn-xs btn-danger'
            onClick={this.onDeleteUserClick}
            data-user-id={user._id}>
            Delete
          </button>
        </td>
      </tr>
    )
  },
  render () {
    const users = this.props.adminUsers || []
    return (
      <section>
        <Helmet htmlAttributes={{class: 'admin-users-page'}} />
        <p className='lead'>
          <span>Manage Users</span>
        </p>
        <table className='table table-condensed table-hover'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role(s)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(this.renderUser)}
          </tbody>
        </table>
      </section>
    )
  }
})

const mapStateToProps = ({ adminUsers }) => ({ adminUsers })
const mapDispatchToProps = { requestAdminUsers, requestAdminDeleteUser, requestAdminUpdateUser, addPopTartMsg }

const AdminUsersContainer = connect(mapStateToProps, mapDispatchToProps)(AdminUsers)

export default function (props) {
  return (
    <RoleChecker role='admin'>
      <AdminUsersContainer {...props} />
    </RoleChecker>
  )
}
