import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'
import Helmet from 'react-helmet'
import { receiveUser } from '../../../redux/actions/user'

const StrategyCallback = React.createClass({
  propTypes: {
    connect: React.PropTypes.object.isRequired,
    jwt: React.PropTypes.string.isRequired,
    config: React.PropTypes.shape({
      apiUrl: React.PropTypes.string.isRequired
    }).isRequired,
    strategy: React.PropTypes.string,
    strategyPretty: React.PropTypes.string
  },

  getInitialState () {
    return { errorMessage: null }
  },

  componentDidMount () {
    if (!this.props.connect || !this.props.connect[this.props.strategy]) {
      return this.setState({ errorMessage: `Failed to connect to ${this.props.strategyPretty}` })
    }

    fetch(`${this.props.config.apiUrl}/connect/${this.props.strategy}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.props.jwt
      },
      body: JSON.stringify(this.props.connect[this.props.strategy])
    }).then((res) => {
      res.json().then((json) => {
        if (res.ok) {
          this.props.receiveUser(json)
          window.location = '/settings?onboardingStage=1'
          return
        }

        console.error('Failed connect', json)
        this.setState({ errorMessage: json.message || `Failed to connect to ${this.props.strategyPretty}` })
      })
      .catch((err) => {
        console.error('Failed connect', err)
        this.setState({ errorMessage: `Failed to connect to ${this.props.strategyPretty}` })
      })
    })
    .catch((err) => {
      console.error('Failed connect', err)
      this.setState({ errorMessage: `Failed to connect to ${this.props.strategyPretty}` })
    })
  },

  render () {
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: `${this.props.strategy}-callback-page`}} />
        <div className='col-lg-12 col-sm-12'>
          <section className='panel'>
            <section className='panel-body'>
              <div className='text-center'>
                <img src={`/imgs/apps/${this.props.strategy}.png`} className='connect-app' />
                <p className='lead'>{this.state.errorMessage || `Connecting with ${this.props.strategyPretty}, please wait...`}</p>
              </div>
            </section>
          </section>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ jwt, config }) => ({ jwt, config })
const mapDispatchToProps = { receiveUser }

export default connect(mapStateToProps, mapDispatchToProps)(StrategyCallback)
