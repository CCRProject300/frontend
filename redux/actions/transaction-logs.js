import fetch from 'isomorphic-fetch'
import qs from 'querystring'

export const REQUEST_TRANSACTION_LOGS = 'REQUEST_TRANSACTION_LOGS'
export function requestTransactionLogs ({ skip = 0, limit }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_TRANSACTION_LOGS, jwt })

    const queryString = qs.stringify({ skip, limit })
    const url = `${getState().config.apiUrl}/transaction-logs?${queryString}`
    const opts = {
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
            dispatch(receiveTransactionLogs(json))
            return json
          } else {
            dispatch(requestTransactionLogsError(json))
            return Promise.reject(new Error(json.message || 'Failed to request transaction logs'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request transaction logs', err)
        dispatch(requestTransactionLogsError(new Error('Request transaction logs failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_TRANSACTION_LOGS = 'RECEIVE_TRANSACTION_LOGS'
export function receiveTransactionLogs (data) {
  return { type: RECEIVE_TRANSACTION_LOGS, ...data }
}

export const REQUEST_TRANSACTION_LOGS_ERROR = 'REQUEST_TRANSACTION_LOGS_ERROR'
export function requestTransactionLogsError (err) {
  return { type: REQUEST_TRANSACTION_LOGS_ERROR, err }
}
