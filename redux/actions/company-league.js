import fetch from 'isomorphic-fetch'

export const REQUEST_CREATE_COMPANY_LEAGUE = 'REQUEST_CREATE_COMPANY_LEAGUE'
export function requestCreateCompanyLeague ({ companyId, payload }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_COMPANY_LEAGUE, jwt, companyId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/league`
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
              dispatch(receiveCreateCompanyLeague(json))
              resolve(json)
            } else {
              dispatch(requestCreateCompanyLeagueError(json))
              reject(json)
            }
          })
        })
        .catch((err) => {
          console.error('Failed to request create company league', err)
          dispatch(requestCreateCompanyLeagueError(new Error('Request create company league failed')))
          reject(err)
        })
    })
  }
}

export const RECEIVE_CREATE_COMPANY_LEAGUE = 'RECEIVE_CREATE_COMPANY_LEAGUE'
export function receiveCreateCompanyLeague (user) {
  return { type: RECEIVE_CREATE_COMPANY_LEAGUE, user }
}

export const REQUEST_CREATE_COMPANY_LEAGUE_ERROR = 'REQUEST_CREATE_COMPANY_LEAGUE_ERROR'
export function requestCreateCompanyLeagueError (err) {
  return { type: REQUEST_CREATE_COMPANY_LEAGUE_ERROR, err }
}

export function requestDeleteCompanyLeague (companyId, leagueId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/company/${companyId}/league/${leagueId}`
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
          ? dispatch(receiveDeleteCompanyLeague(leagueId))
          : dispatch(requestDeleteCompanyLeagueError(res.statusText))
      })
      .catch((err) => {
        console.error('Failed to delete league', err)
        return dispatch(requestDeleteCompanyLeagueError(new Error('Delete league failed')))
      })
  }
}

export const RECEIVE_DELETE_COMPANY_LEAGUE = 'RECEIVE_DELETE_COMPANY_LEAGUE'
export function receiveDeleteCompanyLeague (leagueId) {
  return { type: RECEIVE_DELETE_COMPANY_LEAGUE, leagueId }
}

export const REQUEST_DELETE_COMPANY_LEAGUE_ERROR = 'REQUEST_DELETE_COMPANY_LEAGUE_ERROR'
export function requestDeleteCompanyLeagueError (err) {
  return { type: REQUEST_DELETE_COMPANY_LEAGUE_ERROR, err }
}
