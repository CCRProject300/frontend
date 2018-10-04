import React from 'react'
import { connect } from 'react-redux'
import Footer from './footer.jsx'
import Home from '../pages/home.jsx'
import Authenticator from '../components/authenticator.jsx'
import NotificationsSyncer from '../components/notifications-syncer.jsx'

const LoggedInLayout = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    user: React.PropTypes.object
  },

  render () {
    return (
      <Authenticator noAuth={Home} redirectOnLogin='/profile' {...this.props}>
        <div>
          <NotificationsSyncer />
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            <main role='main' className='bg-gray-lighter p-t-2 p-x-2' style={{paddingBottom: 90, height: '100vh'}}>
              {this.props.children}
              <Footer />
            </main>
          </div>
        </div>
      </Authenticator>
    )
  }
})

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(LoggedInLayout)
