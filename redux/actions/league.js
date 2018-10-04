import fetch from 'isomorphic-fetch'

export const REQUEST_LEAGUE = 'REQUEST_LEAGUE'
export function requestLeague (leagueId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_LEAGUE, jwt })

    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}`
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
            dispatch(receiveLeague(json))
            return json
          } else {
            dispatch(requestLeagueError(json))
            return Promise.reject(new Error(json.message || 'Failed to request league'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request league', err)
        dispatch(requestLeagueError(new Error('Request league failed')))
        return Promise.reject(err)
      })
  }
}

export const REQUEST_PUBLIC_LEAGUE = 'REQUEST_PUBLIC_LEAGUE'
export function requestPublicLeague (leagueId) {
  return (dispatch, getState) => {
    dispatch({type: REQUEST_PUBLIC_LEAGUE})
    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}/public`
    const opts = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    return fetch(url, opts)
      .then((res) => {
        return res.json().then((json) => {
          if (res.ok) {
            dispatch(receiveLeague(json))
            return json
          } else {
            dispatch(requestLeagueError(json))
            return Promise.reject(new Error(json.message || 'Failed to request league'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request league', err)
        dispatch(requestLeagueError(new Error('Request league failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_LEAGUE = 'RECEIVE_LEAGUE'
export function receiveLeague (league) {
  return { type: RECEIVE_LEAGUE, league }
}

export const REQUEST_LEAGUE_ERROR = 'REQUEST_LEAGUE_ERROR'
export function requestLeagueError (err) {
  return { type: REQUEST_LEAGUE_ERROR, err }
}

export const REQUEST_CREATE_LEAGUE = 'REQUEST_CREATE_LEAGUE'
export function requestCreateLeague (payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_LEAGUE, jwt, payload })

    const url = `${getState().config.apiUrl}/league`
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
            dispatch(receiveCreateLeague(json))
            return json
          } else {
            dispatch(requestCreateLeagueError(json))
            return Promise.reject(new Error(json.message || 'Failed to create league'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request create league', err)
        dispatch(requestCreateLeagueError(new Error('Request create league failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_CREATE_LEAGUE = 'RECEIVE_CREATE_LEAGUE'
export function receiveCreateLeague (user) {
  return { type: RECEIVE_CREATE_LEAGUE, user }
}

export const REQUEST_CREATE_LEAGUE_ERROR = 'REQUEST_CREATE_LEAGUE_ERROR'
export function requestCreateLeagueError (err) {
  return { type: REQUEST_CREATE_LEAGUE_ERROR, err }
}

export const REQUEST_DELETE_LEAGUE = 'REQUEST_DELETE_LEAGUE'
export function requestDeleteLeague (leagueId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}`
    const opts = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    return fetch(url, opts)
      .then((res) => {
        if (res.ok) {
          dispatch(receiveDeleteLeague(leagueId))
          return res
        } else {
          return res.json().then((json) => {
            dispatch(requestDeleteLeagueError(json))
            return Promise.reject(json)
          })
        }
      })
      .catch((err) => {
        console.error('Failed to delete league', err)
        dispatch(requestDeleteLeagueError(new Error('Delete league failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_DELETE_LEAGUE = 'RECEIVE_DELETE_LEAGUE'
export function receiveDeleteLeague (leagueId) {
  return { type: RECEIVE_DELETE_LEAGUE, leagueId }
}

export const REQUEST_DELETE_LEAGUE_ERROR = 'REQUEST_DELETE_LEAGUE_ERROR'
export function requestDeleteLeagueError (err) {
  return { type: REQUEST_DELETE_LEAGUE_ERROR, err }
}

export function requestJoinLeague ({ leagueId, panelId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}/join`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    if (panelId) opts.body = JSON.stringify({ panelId })

    return fetch(url, opts)
      .then((res) => res.json().then((json) => {
        if (res.ok) {
          return dispatch(receiveJoinLeague(json))
        }
        dispatch(requestJoinLeagueError(json))
        return Promise.reject(new Error(json.message || 'Failed to join league'))
      }))
      .catch((err) => {
        console.error('Failed to join league', err)
        dispatch(requestJoinLeagueError(new Error('Join league failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_JOIN_LEAGUE = 'RECEIVE_JOIN_LEAGUE'
export function receiveJoinLeague (league) {
  return { type: RECEIVE_JOIN_LEAGUE, league }
}

export const REQUEST_JOIN_LEAGUE_ERROR = 'REQUEST_JOIN_LEAGUE_ERROR'
export function requestJoinLeagueError (err) {
  return { type: REQUEST_JOIN_LEAGUE_ERROR, err }
}
