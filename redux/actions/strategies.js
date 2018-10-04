import fetch from 'isomorphic-fetch'
import { receiveUser } from './user'

export const REQUEST_DISCONNECT_STRATEGY = 'REQUEST_DISCONNECT_STRATEGY'
export function requestDisconnectStrategy (app) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_DISCONNECT_STRATEGY, jwt })

    const url = `${getState().config.apiUrl}/disconnect/${encodeURIComponent(app)}`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    return fetch(url, opts)
      .then((res) => {
        return res.json().then((json) => {
          if (res.ok) {
            dispatch(receiveUser(json))
            return json
          } else {
            dispatch(requestDisconnectStrategyError(json))
            return Promise.reject(new Error(json.message || 'Failed to disconnect'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to disconnect', err)
        dispatch(requestDisconnectStrategyError(new Error('Disconnect failed')))
        return Promise.reject(err)
      })
  }
}

export const REQUEST_DISCONNECT_STRATEGY_ERROR = 'REQUEST_DISCONNECT_STRATEGY_ERROR'
export function requestDisconnectStrategyError (err) {
  return { type: REQUEST_DISCONNECT_STRATEGY_ERROR, err }
}
