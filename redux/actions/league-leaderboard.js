import fetch from 'isomorphic-fetch'

export const REQUEST_LEAGUE_LEADERBOARD = 'REQUEST_LEAGUE_LEADERBOARD'
export function requestLeagueLeaderboard (leagueId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_LEAGUE_LEADERBOARD, jwt })

    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}/leaderboard`
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
            dispatch(receiveLeagueLeaderboard(json))
            return json
          } else {
            dispatch(requestLeagueLeaderboardError(json))
            return Promise.reject(new Error(json.message || 'Failed to request league leaderboard'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request league leaderboard', err)
        dispatch(requestLeagueLeaderboardError(new Error('Request league leaderboard failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_LEAGUE_LEADERBOARD = 'RECEIVE_LEAGUE_LEADERBOARD'
export function receiveLeagueLeaderboard (leaderboard) {
  return { type: RECEIVE_LEAGUE_LEADERBOARD, leaderboard }
}

export const REQUEST_LEAGUE_LEADERBOARD_ERROR = 'REQUEST_LEAGUE_LEADERBOARD_ERROR'
export function requestLeagueLeaderboardError (err) {
  return { type: REQUEST_LEAGUE_LEADERBOARD_ERROR, err }
}
