import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH_USERS = 'REQUEST_SEARCH_USERS'
export function requestSearchUsers ({ q, companyId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_SEARCH_USERS, jwt, q })

    let url = `${getState().config.apiUrl}/search/users?q=${encodeURIComponent(q)}`
    if (companyId) url += `&companyId=${encodeURIComponent(companyId)}`
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
            dispatch(receiveSearchUsers(json))
            return json
          } else {
            dispatch(requestSearchUsersError(json))
            return Promise.reject(new Error(json.message || 'Failed to find users'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request search users', err)
        dispatch(requestSearchUsersError(new Error('Request search users failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_SEARCH_USERS = 'RECEIVE_SEARCH_USERS'
export function receiveSearchUsers (users) {
  return { type: RECEIVE_SEARCH_USERS, users }
}

export const REQUEST_SEARCH_USERS_ERROR = 'REQUEST_SEARCH_USERS_ERROR'
export function requestSearchUsersError (err) {
  return { type: REQUEST_SEARCH_USERS_ERROR, err }
}
