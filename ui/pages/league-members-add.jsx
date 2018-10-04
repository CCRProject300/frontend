import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Modal } from 'react-bootstrap'
import { requestLeague } from '../../redux/actions/league'
import { requestCreateLeagueMembers } from '../../redux/actions/league-members'
import { addPopTartMsg } from '../../redux/actions/popmsgs'
import UserAutocomplete from '../components/user-autocomplete.jsx'

const leagueMembersAdd = React.createClass({
  propTypes: {
    requestLeague: React.PropTypes.func.isRequired,
    requestCreateLeagueMembers: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      leagueId: React.PropTypes.string.isRequired
    }).isRequired,
    companyId: React.PropTypes.string
  },

  getInitialState () {
    return {
      users: [],
      league: {},
      modalShown: false
    }
  },

  componentWillMount () {
    const { requestLeague, params: { leagueId } } = this.props
    requestLeague(leagueId)
      .then((league) => {
        this.setState({ league })
      }).catch((err) => {
        if (err) return console.error(err)
      })
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

  inviteUsersToLeague () {
    this.createLeagueMembers({ invite: true })
  },

  addUsersToLeague () {
    const { league } = this.state

    if (league.teamSize !== 1) return this.setState({ modalShown: true })
    this.createLeagueMembers({ invite: false })
  },

  addUsersToLeagueWithPanel (panelId) {
    this.createLeagueMembers({ invite: false, panelId })
  },

  createLeagueMembers ({ invite, panelId }) {
    const leagueId = this.props.params.leagueId
    let payload = { users: this.state.users.map((u) => u._id) }
    if (panelId) payload.panelId = panelId

    this.props.requestCreateLeagueMembers({ leagueId, panelId, payload, invite })
      .then(() => {
        this.props.addPopTartMsg({message: `Member(s) ${invite ? 'invited' : 'added'}`, level: 'success'})
        browserHistory.push(`/league/${encodeURIComponent(leagueId)}/leaderboard`)
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  hideModal () {
    this.setState({ modalShown: false })
  },

  render () {
    const { addMatchToUsers, props, removeUser, addUsersToLeague, inviteUsersToLeague } = this
    const { users, league } = this.state
    const { members } = league
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'league-members-add' }} />
        <div>
          <h1>Add or Invite Employees</h1>
          {members && <h2 className='gray-light m-b-3' style={{fontWeight: 100}}>{createMembersStatusStatement(members)}</h2>}
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <UserAutocomplete onClick={addMatchToUsers} companyId={props.companyId} />
          </div>
          <div className='col-md-6'>
            {users.length ? (
              <div className='list-group' id='user-list'>
                {users.map((user, ind) => {
                  return (
                    <a href='#' key={ind} className='list-group-item' onClick={removeUser.bind(this, user)}>
                      {user.firstName} {user.lastName}
                      <i className='fa fa-trash-o pull-right'></i>
                    </a>
                  )
                })}
              </div>
            ) : null}
            <button type='button' className='btn btn-danger pull-right add-group m-l-2' onClick={addUsersToLeague}>Add directly</button>
            <button type='button' className='btn btn-info pull-right add-group' onClick={inviteUsersToLeague}>Invite employees</button>
          </div>
        </div>
        {this.renderPanelModal()}
      </section>
    )
  },

  renderPanelModal () {
    const { modalShown, league } = this.state

    if (!league || !league.panels) return null

    return (
      <Modal show={modalShown} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>To start a new team, please select which group you'd like to be in:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {league.panels.map((p) => {
            return (
              <span
                className='h2 label label-tag label-info'
                key={p._id}
                style={{ fontSize: '18px' }}
                onClick={this.addUsersToLeagueWithPanel.bind(this, p._id)}>
                {p.name}
              </span>
            )
          })}
        </Modal.Body>
      </Modal>
    )
  }
})

const mapStateToProps = ({ league }) => {
  if (league && league.company) return { companyId: league.company._id }
  return {}
}

const mapDispatchToProps = {
  requestLeague,
  requestCreateLeagueMembers,
  addPopTartMsg
}

export default connect(mapStateToProps, mapDispatchToProps)(leagueMembersAdd)

export function createMembersStatusStatement (members) {
  const activatedMembers = members.filter((m) => m.activated).length
  let statement = `${members.length} member${members.length === 1 ? ' has' : 's have'} been invited, `
  switch (activatedMembers) {
    case 0:
      statement += 'none have accepted'
      break
    case 1:
      statement += '1 has accepted'
      break
    default:
      statement += `${activatedMembers} have accepted`
  }
  return statement
}
