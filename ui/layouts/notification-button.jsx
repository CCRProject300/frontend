import React from 'react'
import { OverlayTrigger, Button, Popover } from 'react-bootstrap'
import Notification from './notification.jsx'

export default React.createClass({
  propTypes: {
    notifications: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  saveOverlayRef (c) {
    this.overlay = c
  },

  dismiss () {
    this.overlay.hide()
  },

  render () {
    const notifications = this.props.notifications
    const content = notifications.length === 0
      ? (<p>You have no notifications</p>)
      : notifications.map((n) => <Notification notification={n} dismiss={this.dismiss} key={n._id} />)

    return (
      <span className='m-x-1'>
        <OverlayTrigger
          trigger='click'
          rootClose
          placement='bottom'
          overlay={<Popover id='notification-button-popover' className='gray-dark popover-title-bg-yellow' title='Notifications'>{content}</Popover>}
          ref={this.saveOverlayRef}
        >
          <Button className='btn btn-sm navbar-btn' style={{position: 'relative'}}>
            <i className='fa fa-bell-o'></i>
            {notifications.length > 0
              ? (<span style={{position: 'absolute', top: '-7px', right: '-11px'}} className='badge bg-info white'>{notifications.length}</span>)
              : ''}
          </Button>
        </OverlayTrigger>
      </span>
    )
  }
})
