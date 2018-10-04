import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_LEAGUES = 'REQUEST_COMPANY_LEAGUES'
export function requestCompanyLeagues (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_COMPANY_LEAGUES, jwt })

    const url = `${getState().config.apiUrl}/company/${companyId}/leagues`
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
            ? dispatch(receiveCompanyLeagues(json))
            : dispatch(requestCompanyLeaguesError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request leagues', err)
        return dispatch(requestCompanyLeaguesError(new Error('Request leagues failed')))
      })
  }
}

export const RECEIVE_COMPANY_LEAGUES = 'RECEIVE_COMPANY_LEAGUES'
export function receiveCompanyLeagues (leagues) {
  return { type: RECEIVE_COMPANY_LEAGUES, leagues }
}

export const REQUEST_COMPANY_LEAGUES_ERROR = 'REQUEST_COMPANY_LEAGUES_ERROR'
export function requestCompanyLeaguesError (err) {
  return { type: REQUEST_COMPANY_LEAGUES_ERROR, err }
}
