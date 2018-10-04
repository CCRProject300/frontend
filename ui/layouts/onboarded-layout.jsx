import React from 'react'
import { connect } from 'react-redux'
import Header from './header.jsx'
import Sidebar from './sidebar.jsx'
import Footer from './footer.jsx'
import Home from '../pages/home.jsx'
import Onboarding from '../pages/onboarding/index.jsx'
import Authenticator from '../components/authenticator.jsx'
import NotificationsSyncer from '../components/notifications-syncer.jsx'
import userProfileComplete from '../lib/user-profile-complete'

const OnboardedLayout = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    user: React.PropTypes.object,
    company: React.PropTypes.object,
    location: React.PropTypes.object
  },

  render () {
    const { user, company, location } = this.props
    const complete = userProfileComplete(user, company) && typeof (location.query && location.query.onboardingStage) === 'undefined'
    return (
      <Authenticator noAuth={Home} redirectOnLogin='/profile' {...this.props}>
        {complete
          ? (
          <div>
            <NotificationsSyncer />
            <Header />
            <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
              <Sidebar />
              <main role='main' id='main-content' className='bg-gray-lighter p-t-2 p-x-2' style={{paddingBottom: 90}}>
                {this.props.children}
                <Footer />
              </main>
            </div>
          </div>
          )
          : <Onboarding location={this.props.location} />
        }
      </Authenticator>
    )
  }
})

const mapStateToProps = ({ user, companies }) => {
  const company = companies && companies.find((c) => c.name === user.companyName)
  return { user, company }
}
export default connect(mapStateToProps)(OnboardedLayout)
