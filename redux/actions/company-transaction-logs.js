import fetch from 'isomorphic-fetch'
import qs from 'querystring'

export const REQUEST_COMPANY_TRANSACTION_LOGS = 'REQUEST_COMPANY_TRANSACTION_LOGS'
export function requestCompanyTransactionLogs ({ companyId, skip = 0, limit }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_TRANSACTION_LOGS, jwt, companyId })

    const queryString = qs.stringify({ skip, limit })
    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/transaction-logs?${queryString}`
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
            dispatch(receiveCompanyTransactionLogs(json))
            return json
          } else {
            dispatch(requestCompanyTransactionLogsError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company transaction logs'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company transaction logs', err)
        dispatch(requestCompanyTransactionLogsError(new Error('Request company transaction logs failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_TRANSACTION_LOGS = 'RECEIVE_COMPANY_TRANSACTION_LOGS'
export function receiveCompanyTransactionLogs (data) {
  return { type: RECEIVE_COMPANY_TRANSACTION_LOGS, data }
}

export const REQUEST_COMPANY_TRANSACTION_LOGS_ERROR = 'REQUEST_COMPANY_TRANSACTION_LOGS_ERROR'
export function requestCompanyTransactionLogsError (err) {
  return { type: REQUEST_COMPANY_TRANSACTION_LOGS_ERROR, err }
}
