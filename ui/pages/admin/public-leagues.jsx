import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { requestLeagues } from '../../../redux/actions/leagues'
import RoleChecker from '../../components/role-checker.jsx'
import LeaguesTable from '../../components/leagues-table.jsx'

const PublicLeagues = React.createClass({
  propTypes: {
    leagues: PropTypes.array
  },

  componentDidMount () {
    this.props.requestLeagues()
  },

  render () {
    const publicLeagues = this.props.leagues.filter((l) => l.leagueType === 'public')
    return (
      <div>
        <div>
          <p className='lead'>
            <Link to='/admin/league/add' className='p-l-2'>
              <i className='fa fa-plus-square-o'></i> Create League
            </Link>
          </p>
        </div>
        <LeaguesTable leagues={publicLeagues} user={this.props.user} header='' mode='admin' />
      </div>
    )
  }
})

export default () => {
  return (
    <div>
      <Helmet htmlAttributes={{ class: 'admin-leagues-page' }} />
      <RoleChecker role='admin'>
        <PublicLeaguesContainer />
      </RoleChecker>
    </div>
  )
}

const mapStateToProps = ({ user, leagues, config }) => ({ user, leagues, config })
const mapDispatchToProps = { requestLeagues }
const PublicLeaguesContainer = connect(mapStateToProps, mapDispatchToProps)(PublicLeagues)
