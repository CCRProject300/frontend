import React from 'react'
import { connect } from 'react-redux'
import StrategyCallback from './strategy-callback.jsx'

const GoogleFitStrategy = React.createClass({
  propTypes: {
    connect: React.PropTypes.shape({
      'google-fit': React.PropTypes.shape({
        accessToken: React.PropTypes.string.isRequired,
        refreshToken: React.PropTypes.string,
        profile: React.PropTypes.object
      }).isRequired
    }).isRequired
  },

  render () {
    return <StrategyCallback connect={this.props.connect} strategy='google-fit' strategyPretty='Google Fit' />
  }
})

const mapStateToProps = ({ connect }) => ({ connect })

export default connect(mapStateToProps)(GoogleFitStrategy)
