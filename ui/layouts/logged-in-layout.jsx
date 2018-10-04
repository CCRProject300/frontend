import React from 'react'
import { connect } from 'react-redux'
import Header from './header.jsx'
import Sidebar from './sidebar.jsx'
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
          <Header />
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            <Sidebar />
            <main role='main' id='main-content' className='bg-gray-lighter p-t-2 p-x-2' style={{paddingBottom: 90}}>
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
