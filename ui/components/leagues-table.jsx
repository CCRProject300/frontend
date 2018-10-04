import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { Modal } from 'react-bootstrap'
import DateCell from './date-cell.jsx'
import { requestDeleteLeague, requestJoinLeague } from '../../redux/actions/league'
import { addPopTartMsg } from '../../redux/actions/popmsgs'

const LeaguesTable = React.createClass({
  propTypes: {
    leagues: React.PropTypes.arrayOf(React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      startDate: React.PropTypes.string,
      endDate: React.PropTypes.string,
      moderator: React.PropTypes.boolean
    })),
    user: React.PropTypes.object,
    requestDeleteLeague: React.PropTypes.func,
    requestJoinLeague: React.PropTypes.func
  },

  getDefaultProps () {
    return { mode: 'amend' }
  },

  getInitialState () {
    return { modalShown: false }
  },

  removeLeague (league, evt) {
    evt.stopPropagation()
    if (!window.confirm('Are you sure? This cannot be undone.')) return

    this.props.requestDeleteLeague(league._id)
      .then(() => {
        this.props.addPopTartMsg({message: 'League removed', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  checkAndJoinLeague (league) {
    if (league.teamSize === 1 || league.leagueType === 'public') {
      return this.joinLeague({ leagueId: league._id })
    }
    if (league.panels.length === 1) {
      return this.joinLeague({ leagueId: league._id, panelId: league.panels[0]._id })
    }
    this.setState({ selectedLeague: league, modalShown: true })
  },

  joinLeague (params) {
    this.props.requestJoinLeague(params)
      .then(() => {
        browserHistory.push(`/league/${params.leagueId}/leaderboard`)
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  hideModal () {
    this.setState({ modalShown: false })
  },

  render () {
    const { checkAndJoinLeague, removeLeague } = this
    const { leagues, user } = this.props
    if (!leagues || !leagues.length) return null

    return (
      <section className='wrapper'>
        <div className='table-responsive'>
          <table className='table table-panel table-fixed'>
            <thead>
              <tr>
                <th style={{maxWidth: '50%', minWidth: 300}}>League Name</th>
                <th style={{width: 140}}>Type</th>
                <th style={{width: 140}}>Start Date</th>
                <th style={{width: 140}}>End Date</th>
                <th style={{width: 120}}></th>
              </tr>
            </thead>
            <tbody>
              {leagues.map((league) => (
                <LeagueTableRow
                  key={`league-row-${league._id}`}
                  league={league}
                  joinLeague={checkAndJoinLeague}
                  removeLeague={removeLeague}
                  timezone={user.timezone} />
              ))}
            </tbody>
          </table>
        </div>
        {this.renderPanelModal()}
      </section>
    )
  },

  renderPanelModal () {
    const { modalShown, selectedLeague } = this.state

    return (
      <Modal show={modalShown} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>To join this league, please select which group you'd like to join:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeague ? selectedLeague.panels.map((p) => {
            return (
              <span
                className='h2 label label-tag label-info'
                key={p._id}
                style={{ fontSize: '18px' }}
                onClick={this.joinLeague.bind(this, { leagueId: selectedLeague._id, panelId: p._id })}>
                {p.name}
              </span>
            )
          }) : null}
        </Modal.Body>
      </Modal>
    )
  }
})

const LeagueTableRow = ({ league, joinLeague, removeLeague, mode, timezone }) => {
  let icon, action, title, onClick, style

  // Moderators can drill into the league and have an action to delete it
  if (league.moderator) {
    style = { cursor: 'pointer' }
    onClick = () => browserHistory.push(`/league/${league._id}/leaderboard`)
    icon = 'fa-trash-o'
    action = (evt) => {
      evt.stopPropagation()
      removeLeague(league, evt)
    }
    title = 'Delete league'
  // Members can drill in, but have no action
  } else if (league.member) {
    style = { cursor: 'pointer' }
    onClick = () => browserHistory.push(`/league/${league._id}/leaderboard`)
  // If neither, this must be a league the user can join but has no access to drill into yet
  } else {
    icon = 'fa-hand-o-left'
    action = (evt) => {
      evt.stopPropagation()
      joinLeague(league)
    }
    title = 'Join league'
  }

  return (
    <tr onClick={onClick} style={style}>
      <td>
        <p className='lead truncate' style={{minWidth: 200}}>{league.name}</p>
        {league.description ? <p className='truncate'>{league.description}</p> : null}
      </td>
      <td>
        <div className='full-size flex column centered-text'>
          <div className='flex centered' style={{ fontSize: '18px' }}>
            {league.teamSize === 1 ? 'Individuals' : 'Teams'}
          </div>
        </div>
      </td>
      <td><DateCell date={league.startDate && moment.tz(league.startDate, timezone)} /></td>
      <td><DateCell date={league.endDate && moment.tz(league.endDate, timezone)} /></td>
      <td className='center'>
        {action
          ? <button type='button' className='btn btn-link btn-lg' onClick={action} title={title}>
            <i className={`fa ${icon}`} />
          </button>
          : null
        }
      </td>
    </tr>
  )
}

const mapDispatchToProps = { requestDeleteLeague, requestJoinLeague, addPopTartMsg }

export default connect(null, mapDispatchToProps)(LeaguesTable)
