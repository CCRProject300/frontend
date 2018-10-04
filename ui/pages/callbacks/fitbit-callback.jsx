import React from 'react'
import { connect } from 'react-redux'
import StrategyCallback from './strategy-callback.jsx'

const FitbitStrategy = React.createClass({
  propTypes: {
    connect: React.PropTypes.shape({
      fitbit: React.PropTypes.shape({
        accessToken: React.PropTypes.string.isRequired,
        refreshToken: React.PropTypes.string,
        profile: React.PropTypes.object
      }).isRequired
    }).isRequired
  },

  render () {
    return <StrategyCallback connect={this.props.connect} strategy='fitbit' strategyPretty='Fitbit' />
  }
})

const mapStateToProps = ({ connect }) => ({ connect })

export default connect(mapStateToProps)(FitbitStrategy)
