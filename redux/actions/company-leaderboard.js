import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_LEADERBOARD = 'REQUEST_COMPANY_LEADERBOARD'
export function requestCompanyLeaderboard (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_LEADERBOARD, jwt })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/leaderboard?timeframe=weekly`
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
            dispatch(receiveCompanyLeaderboard(json))
            return json
          } else {
            dispatch(requestCompanyLeaderboardError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company leagues leaderboard'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company leagues leaderboard', err)
        dispatch(requestCompanyLeaderboardError(new Error('Request company leagues leaderboard failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_LEADERBOARD = 'RECEIVE_COMPANY_LEADERBOARD'
export function receiveCompanyLeaderboard (leaderboard) {
  return { type: RECEIVE_COMPANY_LEADERBOARD, leaderboard }
}

export const REQUEST_COMPANY_LEADERBOARD_ERROR = 'REQUEST_COMPANY_LEADERBOARD_ERROR'
export function requestCompanyLeaderboardError (err) {
  return { type: REQUEST_COMPANY_LEADERBOARD_ERROR, err }
}
