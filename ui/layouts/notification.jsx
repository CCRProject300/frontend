import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import {
  requestNotifications,
  requestConfirmNotification,
  requestRejectNotification
} from '../../redux/actions/notifications'

const Notification = React.createClass({
  getInitialState () {
    return { submitting: false }
  },

  onAccept (data) {
    this.setState({ submitting: true })

    const {
      notification,
      requestNotifications,
      requestConfirmNotification,
      dismiss
    } = this.props

    requestConfirmNotification(notification, data)
      .then(() => {
        this.setState({ submitting: false })
        requestNotifications()
        dismiss()

        if (notification.url) {
          const external = /^http/.test(notification.url)
          if (external) {
            window.location = notification.url
          } else {
            browserHistory.push(notification.url)
          }
        }
      })
      .catch((err) => {
        console.error('Failed to confirm notification', err)
        this.setState({ submitting: false })
      })
  },

  onReject (data) {
    this.setState({ submitting: true })

    const {
      notification,
      requestNotifications,
      requestRejectNotification,
      dismiss
    } = this.props

    requestRejectNotification(notification, data)
      .then(() => {
        this.setState({ submitting: false })
        requestNotifications()
        dismiss()
      })
      .catch((err) => {
        console.error('Failed to reject notification', err)
        this.setState({ submitting: false })
      })
  },

  render () {
    const { notification } = this.props
    const { submitting } = this.state

    const childProps = {
      notification,
      onAccept: this.onAccept,
      onReject: this.onReject,
      submitting
    }

    switch (notification.type) {
      case 'corpModInvite':
      case 'companyInvite':
      case 'indLeagueInvite':
        return <SimpleNotification {...childProps} />
      case 'groupLeagueInvite':
        return <DropDownNotification {...childProps} />
      case 'onboarding':
      case 'missingStats':
      case 'disconnectedMethod':
      case 'joinedLeague':
        return <InfoNotification {...childProps} />
      default:
        return null
    }
  }
})

function SimpleNotification (props) {
  const notification = props.notification
  return (
    <div className='notification' key={notification._id}>
      <p>{notification.messages[0]} {notification.group.name}. {notification.messages[1]}</p>
      <div className='text-right'>
        <div className='btn-group' role='group'>
          <button className='btn btn-success btn-sm' onClick={props.onAccept.bind(null, null)} disabled={props.submitting}>
            <i className='fa fa-check'></i>
          </button>
          <button className='btn btn-danger btn-sm' onClick={props.onReject.bind(null, null)} disabled={props.submitting}>
            <i className='fa fa-times'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoNotification (props) {
  const notification = props.notification
  return (
    <div className='notification' key={notification._id}>
      <p>{notification.messages[0]}</p>
      <div className='text-right'>
        <div className='btn-group' role='group'>
          <button className='btn btn-success btn-sm' onClick={props.onAccept.bind(null, null)} disabled={props.submitting}>
            <i className='fa fa-check'></i>
          </button>
          <button className='btn btn-danger btn-sm' onClick={props.onReject.bind(null, null)} disabled={props.submitting}>
            <i className='fa fa-times'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

function DropDownNotification (props) {
  const notification = props.notification
  return (
    <div className='notification' key={notification._id}>
      <p>{notification.messages[0]} {notification.group.name}. {notification.messages[1]}</p>
      <p>
        {notification.panels.map((panel) => {
          return (
            <span className='label label-tag label-info' key={panel._id} onClick={props.onAccept.bind(null, { panelId: panel._id })}>
              {panel.name}
            </span>
          )
        })}
      </p>
      <p>
        <span className='label label-tag label-warning' onClick={props.onReject.bind(null, null)}>
          {notification.messages[2]}
        </span>
      </p>
    </div>
  )
}

const mapDispatchToProps = {
  requestNotifications,
  requestConfirmNotification,
  requestRejectNotification
}

export default connect(null, mapDispatchToProps)(Notification)
