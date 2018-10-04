import React from 'react'
import { connect } from 'react-redux'
import { requestSwitchTeam } from '../../../redux/actions/team'
import { requestTeamLeaderboard } from '../../../redux/actions/team-leaderboard'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const JoinButton = React.createClass({
  propTypes: {
    team: React.PropTypes.object,
    league: React.PropTypes.object,
    addPopTartMsg: React.PropTypes.func.isRequired,
    requestSwitchTeam: React.PropTypes.func.isRequired,
    requestTeamLeaderboard: React.PropTypes.func
  },

  joinTeam () {
    const { requestSwitchTeam, requestTeamLeaderboard, addPopTartMsg, team } = this.props
    if (!window.confirm('Are you sure you want to join this team? You will lose ALL the points you have currently accrued in this league, even if you later rejoin your current team.')) return

    requestSwitchTeam(team.league._id, { teamId: team._id })
      .then((team) => {
        addPopTartMsg({ message: 'You have joined this team', level: 'success' })
        requestTeamLeaderboard(team._id)
      })
      .catch((err) => {
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  },

  render () {
    const { team, league } = this.props

    if (!team || !league) return null
    if (!league.member) return null
    if (league.leagueType === 'public') return null
    if (team.member) return null

    const disabled = !team || !league || team.memberCount >= league.teamSize

    return (
      <button className='btn btn-info' onClick={this.joinTeam} disabled={disabled}>
        Join Team
      </button>
    )
  }
})

const mapDispatchToProps = { addPopTartMsg, requestSwitchTeam, requestTeamLeaderboard }
export default connect(null, mapDispatchToProps)(JoinButton)
