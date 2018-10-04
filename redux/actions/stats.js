import fetch from 'isomorphic-fetch'

export const REQUEST_STATS = 'REQUEST_STATS'
export function requestStats () {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_STATS, jwt })

    const url = `${getState().config.apiUrl}/stats`
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
            dispatch(receiveStats(json))
            return json
          } else {
            dispatch(requestStatsError(json))
            return Promise.reject(new Error(json.message || 'Failed to request stats'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request stats', err)
        dispatch(requestStatsError(new Error('Request stats failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_STATS = 'RECEIVE_STATS'
export function receiveStats (stats) {
  return { type: RECEIVE_STATS, stats }
}

export const REQUEST_STATS_ERROR = 'REQUEST_STATS_ERROR'
export function requestStatsError (err) {
  return { type: REQUEST_STATS_ERROR, err }
}
