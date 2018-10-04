import React from 'react'
import { connect } from 'react-redux'
import UserDashboard from './user-dashboard.jsx'
import ModeratorDashboard from './moderator-dashboard.jsx'

const Dashboard = React.createClass({
  propTypes: {
    view: React.PropTypes.string
  },
  render () {
    if (this.props.view === 'corporate_mod') {
      return (<ModeratorDashboard />)
    }
    return <UserDashboard />
  }
})

const mapStateToProps = ({ view }) => ({ view })

export default connect(mapStateToProps)(Dashboard)
