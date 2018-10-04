import React from 'react'
import { connect } from 'react-redux'
import StrategyCallback from './strategy-callback.jsx'

const StravaCallback = React.createClass({
  propTypes: {
    connect: React.PropTypes.shape({
      strava: React.PropTypes.shape({
        accessToken: React.PropTypes.string.isRequired,
        refreshToken: React.PropTypes.string,
        profile: React.PropTypes.object
      }).isRequired
    }).isRequired
  },

  render () {
    return <StrategyCallback connect={this.props.connect} strategy='strava' strategyPretty='Strava' />
  }
})

const mapStateToProps = ({ connect }) => ({ connect })

export default connect(mapStateToProps)(StravaCallback)
