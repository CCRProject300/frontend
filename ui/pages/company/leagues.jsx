import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import moment from 'moment-timezone'
import RoleChecker from '../../components/role-checker.jsx'
import DateCell from '../../components/date-cell.jsx'
import { requestDeleteCompanyLeague } from '../../../redux/actions/company-league'
import { requestCompanyLeagues } from '../../../redux/actions/company-leagues'
import { requestCompanies } from '../../../redux/actions/companies'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

function convertTeamSize (teamSize) {
  if (teamSize === null) return 'Unlimited'
  if (teamSize === 1) return 'Individual'
  return teamSize
}

const CompanyLeagues = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    companyLeagues: React.PropTypes.array.isRequired,
    companies: React.PropTypes.array.isRequired,
    requestCompanyLeagues: React.PropTypes.func.isRequired,
    requestDeleteCompanyLeague: React.PropTypes.func.isRequired,
    requestCompanies: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      companyId: React.PropTypes.string.isRequired
    }).isRequired
  },

  getDefaultProps () {
    return { companies: [] }
  },

  componentDidMount () {
    const company = this.props.companies.find((c) => c._id === this.props.params.companyId)

    if (company) {
      this.props.requestCompanyLeagues(company._id)
    } else {
      this.props.requestCompanies().then((companies) => {
        if (!companies || !companies.length) return
        this.props.requestCompanyLeagues(companies[0]._id)
      })
    }
  },

  deleteLeague (leagueId, evt) {
    evt.stopPropagation()
    const companyId = this.props.companies[0]._id
    if (!window.confirm('Are you sure you want to delete this league?')) return
    this.props.requestDeleteCompanyLeague(companyId, leagueId)
      .then(() => {
        this.props.addPopTartMsg({message: 'League deleted', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  render () {
    const company = this.props.companies[0] || {}
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'moderate-leagues-page' }} />
        <div>
          <p className='lead'>
            {company.name}
            <Link to={`/company/${company._id}/league/add`} className='p-l-2'>
              <i className='fa fa-plus-square-o'></i> Create League
            </Link>
          </p>
          <p>
            <span>{company.description}</span>
          </p>
        </div>
        <div className='table-responsive'>
          <table className='table table-panel table-fixed'>
            <thead>
              <tr className='top-leaderboard'>
                <th>League</th>
                <th style={{width: 140}}>Employees</th>
                <th style={{width: 100}}>Team Size</th>
                <th style={{width: 100}}>Min Size</th>
                <th style={{width: 140}}>Start Date</th>
                <th style={{width: 140}}>End Date</th>
                <th style={{width: 120}}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.props.companyLeagues.map((league, ind) => this.renderCorporateLeagueRow(company, league, ind))}
            </tbody>
          </table>
        </div>
      </section>
    )
  },

  renderCorporateLeagueRow (company, league, ind) {
    const startDate = league.startDate && moment.tz(league.startDate, this.props.user.timezone)
    const endDate = league.endDate && moment.tz(league.endDate, this.props.user.timezone)
    return (
      <tr key={ind} onClick={browserHistory.push.bind(browserHistory, `/league/${league._id}/leaderboard`)} style={{ cursor: 'pointer' }}>
        <td>
          <p className='truncate lead'>
            {league.name}
          </p>
          {league.description
            ? <p className='truncate'>{league.description}</p>
            : ''
          }
        </td>
        <td>
          <div className='full-size flex column members'>
            <div className='flex centered'>
              {league.memberCount}
            </div>
            <div className='flex centered'>
              Employees
            </div>
          </div>
        </td>
        <td>
          <div className='full-size flex column centered-text capitalize'>
            <div className='flex centered'>
              {convertTeamSize(league.teamSize)}
            </div>
          </div>
        </td>
        <td>
          <div className='full-size flex column centered-text capitalize'>
            <div className='flex centered'>
              {league.minTeamSize}
            </div>
          </div>
        </td>
        <td>
          <DateCell date={startDate} />
        </td>
        <td>
          <DateCell date={endDate} />
        </td>
        <td className='center'>
          <button
            type='button'
            className='btn btn-link btn-lg remove-league btn-delete'
            onClick={this.deleteLeague.bind(this, league._id)}
            >
            <i className='fa fa-trash-o'></i>
          </button>
        </td>
      </tr>
    )
  }
})

const mapStateToProps = ({ user, companyLeagues, companies }) => ({ user, companyLeagues, companies })
const mapDispatchToProps = { requestCompanyLeagues, requestCompanies, requestDeleteCompanyLeague, addPopTartMsg }
const CompanyLeaguesContainer = connect(mapStateToProps, mapDispatchToProps)(CompanyLeagues)

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <CompanyLeaguesContainer {...props} />
    </RoleChecker>
  )
}
