import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Helmet from 'react-helmet'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import UserProfile from './user-profile.jsx'
import Devices from './devices.jsx'
import VitalStats from './vital-stats.jsx'

const components = [UserProfile, Devices, VitalStats]

const Onboarding = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    location: React.PropTypes.object,
    companies: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  onUpdateUser (promise) {
    const { location } = this.props
    promise
      .then(() => {
        const stage = parseInt(location.query.onboardingStage || '0') + 1
        this.setStage(stage)
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  setStage (stage) {
    if (!components[stage]) return browserHistory.push('/profile')
    let newLocation = { ...this.props.location }
    newLocation.query = { ...newLocation.query, onboardingStage: stage }
    browserHistory.push(newLocation)
  },

  render () {
    const { onUpdateUser } = this
    const { user, location, companies } = this.props
    const company = (companies && companies[0])
    const Component = components[parseInt(location.query.onboardingStage || '0')]

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'onboarding'}} />
        <div className='flex items-center justify-center' style={{ minHeight: '100vh' }}>
          <div style={{ width: '100%', maxWidth: '60rem' }}>
            <Component onUpdateUser={onUpdateUser} user={user} company={company} />
          </div>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ user, companies }) => ({ user, companies })
const mapDispatchToProps = { addPopTartMsg }

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding)
