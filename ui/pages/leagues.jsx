import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { requestLeagues } from '../../redux/actions/leagues'
import { requestCompanyLeagues } from '../../redux/actions/company-leagues'
import LeaguesTable from '../components/leagues-table.jsx'

const Leagues = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    leagues: React.PropTypes.array,
    companyLeagues: React.PropTypes.array,
    requestLeagues: React.PropTypes.func,
    requestCompanyLeagues: React.PropTypes.func
  },

  componentDidMount () {
    const { user, requestLeagues, requestCompanyLeagues } = this.props

    requestLeagues()
    if (user.company) {
      requestCompanyLeagues(user.company._id)
    }
  },

  render () {
    const { leagues, companyLeagues, user } = this.props
    const categorisedLeagues = leagues.reduce((categories, league) => {
      if (league.member || (league.leagueType === 'private' && league.moderator)) {
        categories.user.push(league)
      } else if (league.leagueType === 'public') {
        categories.public.push(league)
      } else {
        categories.company.push(league)
      }
      return categories
    }, {
      public: [],
      company: companyLeagues.filter((cl) => !leagues.some((l) => l._id === cl._id)),
      user: []
    })

    return (
      <div>
        <Helmet htmlAttributes={{ class: 'user-leagues-all' }} />
        {categorisedLeagues.public.length > 0
          ? <div>
            <p className='lead'>
              Public leagues
            </p>
            <LeaguesTable leagues={categorisedLeagues.public} user={user} />
          </div>
          : null}
        <div>
          <p className='lead'>
            Your leagues
            <Link to='/league/add' className='p-l-2'>
              <i className='fa fa-plus-square-o'></i> Create Private League
            </Link>
          </p>
          {categorisedLeagues.user.length > 0
          ? <LeaguesTable leagues={categorisedLeagues.user} user={user} />
          : null}
        </div>
        {categorisedLeagues.company.length > 0
          ? <div>
            <p className='lead'>
              Company leagues
            </p>
            <LeaguesTable leagues={categorisedLeagues.company} user={user} />
          </div>
          : null}
      </div>
    )
  }
})

const mapStateToProps = ({ user, leagues, companyLeagues }) => ({ user, leagues, companyLeagues })
const mapDispatchToProps = { requestLeagues, requestCompanyLeagues }

export default connect(mapStateToProps, mapDispatchToProps)(Leagues)
