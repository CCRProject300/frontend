import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import moment from 'moment-timezone'
import { requestLeague } from '../../redux/actions/league'
import { requestLeagueLeaderboard } from '../../redux/actions/league-leaderboard'
import StartTeamButton from '../components/league/start-team-button.jsx'

const LeagueLeaderboard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    league: React.PropTypes.object,
    leagueLeaderboard: React.PropTypes.array,
    requestLeague: React.PropTypes.func,
    requestLeagueLeaderboard: React.PropTypes.func,
    params: React.PropTypes.shape({
      leagueId: React.PropTypes.string.isRequired
    }).isRequired
  },

  componentDidMount () {
    const leagueId = this.props.params.leagueId
    this.props.requestLeague(leagueId)
    this.props.requestLeagueLeaderboard(leagueId)
  },

  render () {
    const { league, user, config } = this.props
    if (!league) return null
    const { startDate, endDate, description, teamSize, minTeamSize } = league
    const groupLeague = league.teamSize !== 1

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'league-leaderboard' }} />
        <div>
          <div className='m-y-0 h1 display-ib'><i className='fa fa-trophy' /> {league.name}</div>
          {league.branding ? (
            <Link to={`/league/${encodeURIComponent(league._id)}`} className='m-l-3 btn btn-info display-ib' style={{marginBottom: '12px'}}>Visit the Site</Link>
          ) : null}
        </div>
        <div className='pull-left' style={{ paddingRight: '30px' }}>
          <div><h5 style={{ fontWeight: 'bold' }}>League starts</h5>{startDate ? moment.tz(startDate, user.timezone).format(config.dateFormat) : '-'}</div>
          <div><h5 style={{ fontWeight: 'bold' }}>League ends</h5>{endDate ? moment.tz(endDate, user.timezone).format(config.dateFormat) : '-'}</div>
          <div><h5 style={{ fontWeight: 'bold' }}>Description</h5>{description || '-'}</div>
          <div><h5 style={{ fontWeight: 'bold' }}>Maximum Team Size</h5>{teamSize === 1 ? 'Individual' : (teamSize || 'Unlimited')}</div>
          <div><h5 style={{ fontWeight: 'bold' }}>Minimum Team Size</h5>{minTeamSize}</div>
        </div>
        <div className='pull-right'><StartTeamButton league={league} /></div>
        <div style={{ clear: 'both', marginBottom: '10px' }}></div>
        {this.renderAddMembersButton()}
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr className='top-leaderboard'>
                <th>Ranking</th>
                <th>Name</th>
                {groupLeague
                  ? <th className='text-center'>Team Members</th>
                  : null
                }
                <th>Start Date</th>
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

  renderAddMembersButton () {
    const { league } = this.props
    // display the button if the user can moderate the league
    if (!league.moderator) return null
    return (
      <div>
        <Link to={`/league/${league._id}/members/add`}>
          <h3>
            <i className='fa fa-plus-square-o'></i> Add or Invite Employees
          </h3>
        </Link>
      </div>
    )
  },

  renderRankings () {
    const league = this.props.league

    if (league.teamSize === 1) {
      return this.renderMemberRankings()
    } else {
      return this.renderTeamRankings()
    }
  },

  renderMemberRankings () {
    const rankings = this.props.leagueLeaderboard || []
    return rankings.map((ranking, pos) => (
      <tr className='leaderboard-user' key={pos}>
        <td><span className='position'>{pos + 1}</span></td>
        <td style={{ fontWeight: 'bold' }}>
          {ranking.name}
        </td>
        <td>
          {(ranking.startDate && moment(ranking.startDate).isValid())
            ? moment.tz(ranking.startDate, this.props.user.timezone).format(this.props.config.dateFormat)
            :	'Not started'
          }
        </td>
        <td className='leaderboard-score'><i className='fa fa-heart'></i><span > {ranking.score}</span></td>
      </tr>
    ))
  },

  renderTeamRankings () {
    const rankings = this.props.leagueLeaderboard || []
    const league = this.props.league

    return rankings.map((ranking, pos) => {
      const membersShort = Math.max(league.minTeamSize - ranking.memberCount, 0)
      const sizeClass = membersShort ? 'opacity-50' : ''
      return (
        <tr className='leaderboard-user' key={pos} title={membersShort ? `Recruit ${membersShort} more team members to score points!` : null}>
          <td><span className='position'>{pos + 1}</span></td>
          <td style={{ fontWeight: 'bold' }}>
            <Link to={`/team/${ranking.userId}/leaderboard`}>
              {ranking.name}
              {ranking.panel ? ` (${ranking.panel.name})` : null}
            </Link>
          </td>
          <td className={`text-center ${sizeClass}`}>
            {ranking.memberCount}
          </td>
          <td className={sizeClass}>
            {(ranking.startDate && moment(ranking.startDate).isValid())
              ? moment.tz(ranking.startDate, this.props.user.timezone).format(this.props.config.dateFormat)
              :	'Not started'
            }
          </td>
          <td className={`leaderboard-score ${sizeClass}`}><i className='fa fa-heart'></i><span> {ranking.score}</span></td>
        </tr>
      )
    })
  }
})

const mapStateToProps = ({ user, league, leagueLeaderboard, config }) => ({ user, league, leagueLeaderboard, config })
const mapDispatchToProps = { requestLeague, requestLeagueLeaderboard }

export default connect(mapStateToProps, mapDispatchToProps)(LeagueLeaderboard)
