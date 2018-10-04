import fetch from 'isomorphic-fetch'

export const REQUEST_TEAM = 'REQUEST_TEAM'
export function requestTeam (teamId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_TEAM, jwt })

    const url = `${getState().config.apiUrl}/team/${encodeURIComponent(teamId)}`
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
            dispatch(receiveTeam(json))
            return json
          } else {
            dispatch(requestTeamError(json))
            return Promise.reject(new Error(json.message || 'Failed to request team'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request team', err)
        dispatch(requestTeamError(new Error('Request team failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_TEAM = 'RECEIVE_TEAM'
export function receiveTeam (team) {
  return { type: RECEIVE_TEAM, team }
}

export const REQUEST_TEAM_ERROR = 'REQUEST_TEAM_ERROR'
export function requestTeamError (err) {
  return { type: REQUEST_TEAM_ERROR, err }
}

export const REQUEST_UPDATE_TEAM = 'REQUEST_UPDATE_TEAM'
export function requestUpdateTeam (teamId, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/team/${encodeURIComponent(teamId)}`
    const opts = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(payload)
    }

    return fetch(url, opts)
      .then((res) => {
        if (res.ok) {
          return res.json().then((json) => dispatch(receiveUpdateTeam(json)))
        } else {
          return res.json().then((json) => {
            dispatch(requestUpdateTeamError(json))
            return Promise.reject(json)
          })
        }
      })
      .catch((err) => {
        console.error('Failed to update team', err)
        dispatch(requestUpdateTeamError(new Error('Update team failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_UPDATE_TEAM = 'RECEIVE_UPDATE_TEAM'
export function receiveUpdateTeam (team) {
  return { type: RECEIVE_UPDATE_TEAM, team }
}

export const REQUEST_UPDATE_TEAM_ERROR = 'REQUEST_UPDATE_TEAM_ERROR'
export function requestUpdateTeamError (err) {
  return { type: REQUEST_UPDATE_TEAM_ERROR, err }
}

export const REQUEST_SWITCH_TEAM = 'REQUEST_SWITCH_TEAM'
export function requestSwitchTeam (leagueId, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_SWITCH_TEAM, jwt })

    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}/switch`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(payload)
    }

    return fetch(url, opts)
      .then((res) => {
        return res.json().then((json) => {
          if (res.ok) {
            dispatch(receiveSwitchTeam(json))
            return json
          } else {
            dispatch(requestSwitchTeamError(json))
            return Promise.reject(new Error(json.message || 'Failed to switch teams'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to switch teams', err)
        dispatch(requestSwitchTeamError(new Error('Request for team switch failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_SWITCH_TEAM = 'RECEIVE_SWITCH_TEAM'
export function receiveSwitchTeam (team) {
  return { type: RECEIVE_SWITCH_TEAM, team }
}

export const REQUEST_SWITCH_TEAM_ERROR = 'REQUEST_SWITCH_TEAM_ERROR'
export function requestSwitchTeamError (err) {
  return { type: REQUEST_SWITCH_TEAM_ERROR, err }
}
