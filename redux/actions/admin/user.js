import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_UPDATE_USER = 'REQUEST_ADMIN_UPDATE_USER'
export function requestAdminUpdateUser ({ userId, payload }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_UPDATE_USER, jwt, userId, payload })

    const url = `${getState().config.apiUrl}/admin/user/${encodeURIComponent(userId)}`
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
        return res.json().then((json) => {
          if (res.ok) {
            dispatch(receiveAdminUpdateUser(json))
            return json
          } else {
            dispatch(requestAdminUpdateUserError(json))
            return Promise.reject(new Error(json.message || 'Failed to update user'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request admin create company', err)
        dispatch(requestAdminUpdateUserError(new Error('Request admin update user failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_UPDATE_USER = 'RECEIVE_ADMIN_UPDATE_USER'
export function receiveAdminUpdateUser (user) {
  return { type: RECEIVE_ADMIN_UPDATE_USER, user }
}

export const REQUEST_ADMIN_UPDATE_USER_ERROR = 'REQUEST_ADMIN_UPDATE_USER_ERROR'
export function requestAdminUpdateUserError (err) {
  return { type: REQUEST_ADMIN_UPDATE_USER_ERROR, err }
}

export const REQUEST_ADMIN_DELETE_USER = 'REQUEST_ADMIN_DELETE_USER'
export function requestAdminDeleteUser (userId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_DELETE_USER, jwt, userId })

    const url = `${getState().config.apiUrl}/admin/user/${encodeURIComponent(userId)}`
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
          dispatch(receiveAdminDeleteUser(userId))
          return res
        } else {
          return res.json().then((json) => {
            dispatch(requestAdminDeleteUserError(json))
            return Promise.reject(new Error(json.message || 'Failed to delete user'))
          })
        }
      })
      .catch((err) => {
        console.error('Failed to request admin delete user', err)
        dispatch(requestAdminDeleteUserError(new Error('Request admin delete user failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_DELETE_USER = 'RECEIVE_ADMIN_DELETE_USER'
export function receiveAdminDeleteUser (userId) {
  return { type: RECEIVE_ADMIN_DELETE_USER, userId }
}

export const REQUEST_ADMIN_DELETE_USER_ERROR = 'REQUEST_ADMIN_DELETE_USER_ERROR'
export function requestAdminDeleteUserError (err) {
  return { type: REQUEST_ADMIN_DELETE_USER_ERROR, err }
}
