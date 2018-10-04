import fetch from 'isomorphic-fetch'

export const REQUEST_MODERATORS = 'REQUEST_MODERATORS'
export function requestModerators (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_MODERATORS, jwt, companyId })

    const url = `${getState().config.apiUrl}/admin/company/${companyId}/moderators`
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
            ? dispatch(receiveModerators(json))
            : dispatch(requestModeratorsError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request moderators', err)
        return dispatch(requestModeratorsError(new Error('Request moderators failed')))
      })
  }
}

export const RECEIVE_MODERATORS = 'RECEIVE_MODERATORS'
export function receiveModerators (moderators) {
  return { type: RECEIVE_MODERATORS, moderators }
}

export const REQUEST_MODERATORS_ERROR = 'REQUEST_MODERATORS_ERROR'
export function requestModeratorsError (err) {
  return { type: REQUEST_MODERATORS_ERROR, err }
}

export function requestDeleteModerator (companyId, userId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/moderator/${userId}`
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
          ? dispatch(receiveDeleteModerator(userId))
          : dispatch(requestDeleteModeratorError(res.statusText))
      })
      .catch((err) => {
        console.error('Failed to delete moderator', err)
        return dispatch(requestDeleteModeratorError(new Error('Delete moderator failed')))
      })
  }
}

export const RECEIVE_DELETE_MODERATOR = 'RECEIVE_DELETE_MODERATOR'
export function receiveDeleteModerator (userId) {
  return { type: RECEIVE_DELETE_MODERATOR, userId }
}

export const REQUEST_DELETE_MODERATOR_ERROR = 'REQUEST_DELETE_MODERATOR_ERROR'
export function requestDeleteModeratorError (err) {
  return { type: REQUEST_DELETE_MODERATOR_ERROR, err }
}
