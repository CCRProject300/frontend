import fetch from 'isomorphic-fetch'

export const REQUEST_LEAGUES = 'REQUEST_LEAGUES'
export function requestLeagues () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_LEAGUES, jwt })

    const url = `${getState().config.apiUrl}/leagues`
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
          return res.ok
            ? dispatch(receiveLeagues(json))
            : dispatch(requestLeaguesError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request leagues', err)
        return dispatch(requestLeaguesError(new Error('Request leagues failed')))
      })
  }
}

export const RECEIVE_LEAGUES = 'RECEIVE_LEAGUES'
export function receiveLeagues (leagues) {
  return { type: RECEIVE_LEAGUES, leagues }
}

export const REQUEST_LEAGUES_ERROR = 'REQUEST_LEAGUES_ERROR'
export function requestLeaguesError (err) {
  return { type: REQUEST_LEAGUES_ERROR, err }
}
