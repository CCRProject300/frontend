import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_LEAGUES_LEADERBOARD = 'REQUEST_COMPANY_LEAGUES_LEADERBOARD'
export function requestCompanyLeaguesLeaderboard (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_LEAGUES_LEADERBOARD, jwt })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/leagues-leaderboard?timeframe=weekly`
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
            dispatch(receiveCompanyLeaguesLeaderboard(json))
            return json
          } else {
            dispatch(requestCompanyLeaguesLeaderboardError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company leagues leaderboard'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company leagues leaderboard', err)
        dispatch(requestCompanyLeaguesLeaderboardError(new Error('Request company leagues leaderboard failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_LEAGUES_LEADERBOARD = 'RECEIVE_COMPANY_LEAGUES_LEADERBOARD'
export function receiveCompanyLeaguesLeaderboard (leaderboard) {
  return { type: RECEIVE_COMPANY_LEAGUES_LEADERBOARD, leaderboard }
}

export const REQUEST_COMPANY_LEAGUES_LEADERBOARD_ERROR = 'REQUEST_COMPANY_LEAGUES_LEADERBOARD_ERROR'
export function requestCompanyLeaguesLeaderboardError (err) {
  return { type: REQUEST_COMPANY_LEAGUES_LEADERBOARD_ERROR, err }
}
