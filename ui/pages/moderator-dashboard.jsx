import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Stat from '../components/stat.jsx'
import BarChart from '../components/dashboard/barchart.jsx'
import LeaderBoard from '../components/dashboard/leaderboard.jsx'
import CompanyStandings from '../components/dashboard/company-standings.jsx'
import NoDataPanel from '../components/dashboard/no-data-panel.jsx'
import { requestCompanies } from '../../redux/actions/companies'
import { requestCompanyStats } from '../../redux/actions/company-stats'
import { hasRole } from '../../lib/roles'

const ModeratorDashboard = React.createClass({
  propTypes: {
    companyStats: React.PropTypes.shape({
      pctActiveEmployees: React.PropTypes.number.isRequired,
      averagePointsLastWeek: React.PropTypes.number.isRequired,
      averageKudosCoins: React.PropTypes.number.isRequired,
      numberNewMembersInLastWeek: React.PropTypes.number.isRequired,
      percentageChange: React.PropTypes.number.isRequired,
      standings: React.PropTypes.shape({
        company: React.PropTypes.shape({
          name: React.PropTypes.string.isRequired,
          data: React.PropTypes.shape({
            monthlyAverage: React.PropTypes.number,
            age: React.PropTypes.shape({
              '16-24': React.PropTypes.number,
              '25-34': React.PropTypes.number,
              '35-44': React.PropTypes.number,
              '45-54': React.PropTypes.number,
              '55-64': React.PropTypes.number,
              '65+': React.PropTypes.number
            }),
            gender: React.PropTypes.shape({
              Male: React.PropTypes.number,
              Female: React.PropTypes.number,
              Other: React.PropTypes.number
            })
          }).isRequired
        }),
        community: React.PropTypes.shape({
          name: React.PropTypes.string.isRequired,
          data: React.PropTypes.shape({
            monthlyAverage: React.PropTypes.number,
            age: React.PropTypes.shape({
              '16-24': React.PropTypes.number,
              '25-34': React.PropTypes.number,
              '35-44': React.PropTypes.number,
              '45-54': React.PropTypes.number,
              '55-64': React.PropTypes.number,
              '65+': React.PropTypes.number
            }),
            gender: React.PropTypes.shape({
              Male: React.PropTypes.number,
              Female: React.PropTypes.number,
              Other: React.PropTypes.number
            })
          }).isRequired
        })
      }),
      kudosPoints: React.PropTypes.shape({
        labels: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
        legend: React.PropTypes.shape({
          'x-axis': React.PropTypes.string.isRequired,
          'y-axis': React.PropTypes.string.isRequired
        }).isRequired,
        series: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired
      }),
      ranking: React.PropTypes.shape({
        globalRanking: React.PropTypes.number.isRequired,
        activeUsers: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
        monthlySum: React.PropTypes.number.isRequired,
        monthlyDiff: React.PropTypes.number.isRequired
      }),
      leaderboard: React.PropTypes.shape({
        users: React.PropTypes.shape({
          all: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          week: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          month: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired
        }),
        leagues: React.PropTypes.shape({
          all: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          week: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          month: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired
        }),
        departments: React.PropTypes.shape({
          all: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          week: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          month: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired
        }),
        locations: React.PropTypes.shape({
          all: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          week: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired,
          month: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            avgPoints: React.PropTypes.number.isRequired,
            points: React.PropTypes.number.isRequired
          })).isRequired
        })
      })
    }),
    requestCompanies: React.PropTypes.func,
    requestCompanyStats: React.PropTypes.func,
    user: React.PropTypes.object
  },

  componentDidMount () {
    // Until the app supports company switching we assume 1 company per user
    this.props.requestCompanies()
      .then((companies) => {
        if (!companies || !companies.length) return
        this.props.requestCompanyStats(companies[0]._id)
      })
  },

  render () {
    const stats = this.props.companyStats
    if (!stats) return <div className='h2 m-t-4 text-center'>Loading data...</div>

    const averagePointsData = stats.kudosPoints || []
    const leaderBoardData = stats.leaderboard
    const standingsData = stats.standings
    const noData = !(leaderBoardData || standingsData)
    const noDataMessages = ['We don\'t have any data available for you.', 'Please check back when today\'s stats have been calculated.']

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'moderator-page'}} />
        <div className='row state-overview'>
          <div className='col-lg-3 col-sm-6'>
            <Stat icon='heart' color='red' label={['Employees', 'are engaged']} value={stats.pctActiveEmployees} suffix='%' />
          </div>
          <div className='col-lg-3 col-sm-6'>
            <Stat icon='calendar' color='blue' label={['Average Points', '(last 7 days)']} value={stats.averagePointsLastWeek} />
          </div>
          <div className='col-lg-3 col-sm-6'>
            <Stat icon='plus' color='teal' label={['New Employees', '(last 7 days)']} value={stats.numberNewMembersInLastWeek} prefix={stats.numberNewMembersInLastWeek > 0 ? '+' : ''} />
          </div>
          <div className='col-lg-3 col-sm-6'>
            <Stat icon='bar-chart' color='yellow' label={['Percentage Change', '(last 7 days)']} value={stats.percentageChange ? stats.percentageChange : 0} suffix='%' />
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h3 className='panel-title'>Monthly KudosPoints</h3>
              </div>
              <div className='panel-body'>
                <BarChart data={averagePointsData} />
                <div className='text-center'><small>Average Monthly KudosPoints per Employee</small></div>
              </div>
            </div>
            {standingsData && (
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className='panel-title'>Company Comparison</h3>
                </div>
                <div className='panel-body'>
                  <CompanyStandings data={standingsData} />
                </div>
              </div>
            )}
          </div>
          <div className='col-lg-6'>
            {noData && (
              <NoDataPanel title='No Data' messages={noDataMessages} height={295} />
            )}
            {leaderBoardData && (
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className='panel-title'>Company Overview</h3>
                </div>
                <div className='panel-body leaderboard'>
                  <div className='leaderboard-users'>
                    <LeaderBoard title='Top 5 Users' data={leaderBoardData.users} />
                  </div>
                  <div className='leaderboard-leagues'>
                    <LeaderBoard title='Top 5 Leagues' data={leaderBoardData.leagues} />
                  </div>
                  <div className='leaderboard-departments'>
                    <LeaderBoard title='Top 5 Departments' data={leaderBoardData.departments} />
                  </div>
                  <div className='leaderboard-locations'>
                    <LeaderBoard title='Top 5 Locations' data={leaderBoardData.locations} />
                  </div>
                </div>
              </div>
            )}
            {hasRole(this.props.user, 'rewards') ? (
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className='panel-title'>KudosCoins</h3>
                </div>
                <div className='panel-body'>
                  <section className='display-t text-center'>
                    <div className='display-tc w-40 v-mid'>
                      <div className='coin coin-xl'></div>
                    </div>
                    <div className='display-tc w-60 v-mid gray-light p-y-2 line-height-1'>
                      <div className='font-xl count m-b-2'>{Math.round(stats.averageKudosCoins * 100) / 100}</div>
                      <div className='m-t-1 m-b-0'>
                        <small>Average Weekly KudosCoins<br />Earned per Employee</small>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ companyStats, config, user }) => ({ companyStats, config, user })
const mapDispatchToProps = { requestCompanies, requestCompanyStats }

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard)
