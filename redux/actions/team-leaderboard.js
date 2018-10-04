import fetch from 'isomorphic-fetch'

export const REQUEST_TEAM_LEADERBOARD = 'REQUEST_TEAM_LEADERBOARD'
export function requestTeamLeaderboard (teamId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_TEAM_LEADERBOARD, jwt })

    const url = `${getState().config.apiUrl}/team/${encodeURIComponent(teamId)}/leaderboard`
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
            dispatch(receiveTeamLeaderboard(json))
            return json
          } else {
            dispatch(requestTeamLeaderboardError(json))
            return Promise.reject(new Error(json.message || 'Failed to request team leaderboard'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request team leaderboard', err)
        dispatch(requestTeamLeaderboardError(new Error('Request team leaderboard failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_TEAM_LEADERBOARD = 'RECEIVE_TEAM_LEADERBOARD'
export function receiveTeamLeaderboard (leaderboard) {
  return { type: RECEIVE_TEAM_LEADERBOARD, leaderboard }
}

export const REQUEST_TEAM_LEADERBOARD_ERROR = 'REQUEST_TEAM_LEADERBOARD_ERROR'
export function requestTeamLeaderboardError (err) {
  return { type: REQUEST_TEAM_LEADERBOARD_ERROR, err }
}
