import React from 'react'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'

const style = {
  NotificationItem: {
    DefaultStyle: {
      margin: '24px 24px 4px 0',
      display: 'block'
    },
    success: {
      backgroundColor: '#a9d86e',
      color: 'white'
    },
    error: {
      backgroundColor: '#ff6c60',
      color: 'white'
    },
    warning: {
      backgroundColor: '#fcb322',
      color: '#35404d'
    },
    info: {
      backgroundColor: '#35404d',
      color: 'white'
    }
  }
}

const PopTart = React.createClass({
  propTypes: {
    removePopTartMsg: React.PropTypes.func
  },
  componentDidMount () {
    this.notificationSystem = this.refs.notificationSystem
  },
  componentWillReceiveProps (newProps) {
    const popMsg = newProps.popMsgs.pop()
    if (!popMsg.level) popMsg.level = 'info'
    this.notificationSystem.addNotification(popMsg)
  },
  render () {
    return (
      <NotificationSystem ref='notificationSystem' style={style} />
    )
  }
})

const mapStateToProps = function (state) {
  return { popMsgs: state.popMsg }
}

export default connect(mapStateToProps)(PopTart)
