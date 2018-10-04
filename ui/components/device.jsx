import React from 'react'
import { connect } from 'react-redux'
import { requestDisconnectStrategy } from '../../redux/actions/strategies'
import { addPopTartMsg } from '../../redux/actions/popmsgs'

function Device ({ user, app, requestDisconnectStrategy, addPopTartMsg }) {
  const connected = (user.methods || []).some((m) => m === app)
  const appName = app[0].toUpperCase() + app.slice(1)
  const disconnect = () => {
    requestDisconnectStrategy(app)
      .then(() => {
        addPopTartMsg({message: `${appName} disconnected`, level: 'success'})
      })
      .catch((err) => {
        addPopTartMsg({message: err.message, level: 'error'})
      })
  }

  return (
    <div className='m-b-2'>
      <img src={`/imgs/apps/${app}.png`} className='m-r-2' style={{height: 46}} />
      {connected
        ? <button
          onClick={disconnect}
          className='btn btn-lg btn-outline btn-primary'
        >
            Disconnect from {appName}
        </button>
        : (
        <a
          href={`/connect/${app}`}
          className='btn btn-lg btn-primary'
        >
            Connect {appName}
        </a>
        )}
    </div>
  )
}

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = { requestDisconnectStrategy, addPopTartMsg }

export default connect(mapStateToProps, mapDispatchToProps)(Device)
