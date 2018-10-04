import fetch from 'isomorphic-fetch'

export const REQUEST_CREATE_PUBLIC_LEAGUE = 'REQUEST_CREATE_PUBLIC_LEAGUE'
export function requestCreatePublicLeague ({ payload }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_PUBLIC_LEAGUE, jwt, payload })

    const url = `${getState().config.apiUrl}/admin/league`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(payload)
    }

    return new Promise((resolve, reject) => {
      fetch(url, opts)
        .then((res) => {
          return res.json().then((json) => {
            if (res.ok) {
              dispatch(receiveCreatePublicLeague(json))
              resolve(json)
            } else {
              dispatch(requestCreatePublicLeagueError(json))
              reject(json)
            }
          })
        })
        .catch((err) => {
          console.error('Failed to request create public league', err)
          dispatch(requestCreatePublicLeagueError(new Error('Request create public league failed')))
          reject(err)
        })
    })
  }
}

export const RECEIVE_CREATE_PUBLIC_LEAGUE = 'RECEIVE_CREATE_PUBLIC_LEAGUE'
export function receiveCreatePublicLeague (user) {
  return { type: RECEIVE_CREATE_PUBLIC_LEAGUE, user }
}

export const REQUEST_CREATE_PUBLIC_LEAGUE_ERROR = 'REQUEST_CREATE_PUBLIC_LEAGUE_ERROR'
export function requestCreatePublicLeagueError (err) {
  return { type: REQUEST_CREATE_PUBLIC_LEAGUE_ERROR, err }
}

export function requestDeletePublicLeague (leagueId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/admin/league/${leagueId}`
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
        return res.ok
          ? dispatch(receiveDeletePublicLeague(leagueId))
          : dispatch(requestDeletePublicLeagueError(res.statusText))
      })
      .catch((err) => {
        console.error('Failed to delete league', err)
        return dispatch(requestDeletePublicLeagueError(new Error('Delete league failed')))
      })
  }
}

export const RECEIVE_DELETE_PUBLIC_LEAGUE = 'RECEIVE_DELETE_PUBLIC_LEAGUE'
export function receiveDeletePublicLeague (leagueId) {
  return { type: RECEIVE_DELETE_PUBLIC_LEAGUE, leagueId }
}

export const REQUEST_DELETE_PUBLIC_LEAGUE_ERROR = 'REQUEST_DELETE_PUBLIC_LEAGUE_ERROR'
export function requestDeletePublicLeagueError (err) {
  return { type: REQUEST_DELETE_PUBLIC_LEAGUE_ERROR, err }
}
