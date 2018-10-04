import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_USERS = 'REQUEST_ADMIN_USERS'
export function requestAdminUsers () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_ADMIN_USERS, jwt })

    const url = `${getState().config.apiUrl}/admin/users`
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
            dispatch(receiveAdminUsers(json))
            return json
          } else {
            dispatch(requestAdminUsersError(json))
            return Promise.reject(new Error(json.message || 'Failed to request admin users'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request admin users', err)
        dispatch(requestAdminUsersError(new Error('Request admin users failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_USERS = 'RECEIVE_ADMIN_USERS'
export function receiveAdminUsers (users) {
  return { type: RECEIVE_ADMIN_USERS, users }
}

export const REQUEST_ADMIN_USERS_ERROR = 'REQUEST_ADMIN_USERS_ERROR'
export function requestAdminUsersError (err) {
  return { type: REQUEST_ADMIN_USERS_ERROR, err }
}
