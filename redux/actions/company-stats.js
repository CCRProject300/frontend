import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_STATS = 'REQUEST_COMPANY_STATS'
export function requestCompanyStats (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_STATS, jwt })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/stats`
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
            dispatch(receiveCompanyStats(json))
            return json
          } else {
            dispatch(requestCompanyStatsError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company stats'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company stats', err)
        dispatch(requestCompanyStatsError(new Error('Request company stats failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_STATS = 'RECEIVE_COMPANY_STATS'
export function receiveCompanyStats (stats) {
  return { type: RECEIVE_COMPANY_STATS, stats }
}

export const REQUEST_COMPANY_STATS_ERROR = 'REQUEST_COMPANY_STATS_ERROR'
export function requestCompanyStatsError (err) {
  return { type: REQUEST_COMPANY_STATS_ERROR, err }
}
