import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment-timezone'
import EditableTeamName from '../components/editable-team-name.jsx'
import { requestTeam } from '../../redux/actions/team'
import { requestLeague } from '../../redux/actions/league'
import { requestTeamLeaderboard } from '../../redux/actions/team-leaderboard'
import JoinTeamButton from '../components/team/join-team-button.jsx'

const TeamLeaderboard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    team: React.PropTypes.object,
    teamLeaderboard: React.PropTypes.array,
    requestTeam: React.PropTypes.func,
    requestTeamLeaderboard: React.PropTypes.func,
    requestLeague: React.PropTypes.func,
    params: React.PropTypes.shape({
      teamId: React.PropTypes.string.isRequired
    }).isRequired
  },

  componentDidMount () {
    const teamId = this.props.params.teamId
    this.getTeamDetails(teamId)
  },

  componentWillReceiveProps ({ params }) {
    if (params && params.teamId !== (this.props.params && this.props.params.teamId)) {
      this.getTeamDetails(params.teamId)
    }
  },

  getTeamDetails (teamId) {
    this.props.requestTeamLeaderboard(teamId)
    this.props.requestTeam(teamId)
      .then((team) => {
        this.props.requestLeague(team.league._id)
      })
  },

  render () {
    const { team, league } = this.props
    if (!team) return null

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'team-leaderboard' }} />
        <EditableTeamName team={team} />
        <div>
          <div className='pull-left' style={{ paddingRight: '30px' }}>
            {team.panel && team.panel.name
              ? <div>
                <h5 style={{ fontWeight: 'bold' }}>Category</h5>
                {team.panel.name}
              </div>
              : null
            }
            <div>
              <h5 style={{ fontWeight: 'bold' }}>League starts</h5>
              {team.startDate ? moment.tz(team.startDate, this.props.user.timezone).format(this.props.config.dateFormat) : '-'}
            </div>
            <div>
              <h5 style={{ fontWeight: 'bold' }}>League ends</h5>
              {team.endDate ? moment.tz(team.endDate, this.props.user.timezone).format(this.props.config.dateFormat) : '-'}
            </div>
          </div>
          <div className='pull-right'><JoinTeamButton team={team} league={league} /></div>
        </div>
        <div style={{ clear: 'both', marginBottom: '10px' }}></div>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr className='top-leaderboard'>
                <th>Ranking</th>
                <th>Name</th>
                <th>Status</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRankings()}
            </tbody>
          </table>
        </div>
      </section>
    )
  },

  renderRankings () {
    const rankings = this.props.teamLeaderboard || []

    return rankings.map((ranking, pos) => (
      <tr className='leaderboard-user' key={pos}>
        <td><span className='position'>{pos + 1}</span></td>
        <td style={{ fontWeight: 'bold' }}>
          {ranking.name}
        </td>
        <td>
          started
        </td>
        <td className='leaderboard-score'><i className='fa fa-heart'></i><span > {ranking.score}</span></td>
      </tr>
    ))
  }
})

const mapStateToProps = ({ user, league, teamLeaderboard, team, config }) => ({ user, league, teamLeaderboard, team, config })
const mapDispatchToProps = { requestTeam, requestTeamLeaderboard, requestLeague }

export default connect(mapStateToProps, mapDispatchToProps)(TeamLeaderboard)
