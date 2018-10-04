import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
import { requestStats } from '../../redux/actions/stats'
import { requestGraph } from '../../redux/actions/graph'
import { hasRole } from '../../lib/roles'
import Stat from '../components/stat.jsx'
import Podium from '../components/dashboard/podium.jsx'
import Standings from '../components/dashboard/standings.jsx'
import Leagues from '../components/dashboard/leagues.jsx'
import NoDataPanel from '../components/dashboard/no-data-panel.jsx'
import KudosPointsGraph from '../components/dashboard/kudos-points-graph.jsx'

const timespanMap = {
  daily: {days: 1},
  weekly: {days: 7},
  monthly: {months: 1}
}

const UserDashboard = React.createClass({
  propTypes: {
    stats: React.PropTypes.shape({
      dailySum: React.PropTypes.number.isRequired,
      weeklySum: React.PropTypes.number.isRequired,
      monthlySum: React.PropTypes.number.isRequired,
      threeMonthlySum: React.PropTypes.number.isRequired,
      leagues: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        userIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        ranking: React.PropTypes.number.isRequired,
        progress: React.PropTypes.number.isRequired
      })),
      standings: React.PropTypes.arrayOf(React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        percent: React.PropTypes.number.isRequired,
        ranking: React.PropTypes.number.isRequired
      })),
      rankings: React.PropTypes.arrayOf(React.PropTypes.shape({
        companyName: React.PropTypes.string.isRequired,
        globalRanking: React.PropTypes.number.isRequired,
        podium: React.PropTypes.arrayOf(React.PropTypes.shape({
          _id: React.PropTypes.string.isRequired,
          kudosPoints: React.PropTypes.number.isRequired,
          name: React.PropTypes.string.isRequired,
          image: React.PropTypes.string.isRequired
        })),
        date: React.PropTypes.string.isRequired
      }))
    }),
    graph: React.PropTypes.shape({
      labels: React.PropTypes.array.isRequired,
      series: React.PropTypes.arrayOf(React.PropTypes.array).isRequired
    }),
    requestStats: React.PropTypes.func,
    requestGraph: React.PropTypes.func,
    user: React.PropTypes.object
  },

  componentWillMount () {
    this.props.requestStats()
    this.props.requestGraph({ timespan: this.state.timespan })
  },

  getInitialState () {
    const timespan = 'weekly'
    const startDate = moment.utc().startOf('day').toISOString()
    return {
      timespan,
      startDate,
      loading: false
    }
  },

  hasUnconnectedDevices () {
    return this.props.user && (!this.props.user.methods || this.props.user.methods.length < 3)
  },

  getNewStartDate (startDate, method, timespan) {
    const mo = moment(startDate).utc()
    const arg = timespanMap[timespan]
    mo[method](arg)
    const now = moment.utc()
    return mo.isAfter(now) ? startDate : mo.toISOString()
  },

  updateStartDate (method) {
    const {timespan, startDate: prevStartDate, loading} = this.state
    if (loading) return
    const startDate = this.getNewStartDate(prevStartDate, method, timespan)
    this.setState({loading: true})
    this.props.requestGraph({ timespan, startDate })
      .then(() => this.setState({ startDate, timespan, loading: false }))
  },

  updateTimespan (timespan) {
    const startDate = moment.utc().toISOString()
    this.setState({loading: true})
    this.props.requestGraph({ timespan, startDate })
      .then(() => this.setState({ timespan, startDate, loading: false }))
  },

  render () {
    const {graph, user} = this.props
    const {timespan, loading, startDate} = this.state
    const ranking = (this.props.stats && this.props.stats.rankings && this.props.stats.rankings[0])
    const standingsData = this.props.stats && this.props.stats.standings
    const leaguesData = this.props.stats && this.props.stats.leagues
    const podiumTitle = 'Weekly Top Performers'
    const noData = !(ranking || (standingsData && standingsData.length) || (leaguesData && leaguesData.length))
    const noDataMessages = ['We don\'t have any data available for you.']
    noDataMessages.push(
      (this.props.user.methods && this.props.user.methods.length)
        ? 'Please check back when today\'s stats have been calculated.'
        : 'You need to connect some apps first.'
    )
    return (
      <div>
        <Helmet htmlAttributes={{class: 'profile-page'}} />
        <Stats stats={this.props.stats} user={user} />
        <div className='row'>
          <div className='col-lg-6'>
            <KudosPointsGraph
              graph={graph}
              timespan={timespan}
              startDate={startDate}
              onChangeTimespan={this.updateTimespan}
              onChangeStartDate={this.updateStartDate}
              hasUnconnectedDevices={this.hasUnconnectedDevices()}
              loading={loading}
            />
          </div>
          {noData && (
            <div className='col-lg-6'>
              <NoDataPanel title='No Data' messages={noDataMessages} height={330} />
            </div>
          )}
          {ranking && (
            <div className='col-lg-6'>
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className='panel-title'>{ranking.companyName}</h3>
                </div>
                <div className='panel-body p-x-0'>
                  <Podium title={podiumTitle} podium={ranking.podium} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='row'>
          {(standingsData && standingsData.length)
            ? (<div className='col-lg-6'>
              <Standings standings={standingsData} />
            </div>
          ) : null}
          {(leaguesData && leaguesData.length)
            ? (<div className='col-lg-6'>
              <Leagues leagues={leaguesData} />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
})

function Stats ({ stats, user }) {
  if (!stats) return null
  const showCoins = hasRole(user, 'rewards')
  return (
    <div className='row state-overview'>
      <div className='col-lg-3 col-sm-6'>
        <Stat icon='user' color='blue' label='KudosPoints today' value={stats.dailySum} />
      </div>
      <div className='col-lg-3 col-sm-6'>
        <Stat icon='calendar-plus-o' color='teal' label='KudosPoints last 7 days' value={stats.weeklySum} />
      </div>
      <div className='col-lg-3 col-sm-6'>
        <Stat icon='calendar' color='red' label='KudosPoints last month' value={stats.monthlySum} />
      </div>
      <div className='col-lg-3 col-sm-6'>
        {showCoins ? (
          <Stat color='yellow' label='KudosCoins' value={user.kudosCoins}>
            <div className='coin coin-lg coin-white' />
          </Stat>
        ) : (
          <Stat icon='bar-chart-o' color='yellow' label='KudosPoints last 90 days' value={stats.threeMonthlySum} />
        )}
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, stats, graph }) => ({ user, stats, graph })
const mapDispatchToProps = { requestStats, requestGraph }

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
