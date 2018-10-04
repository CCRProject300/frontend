import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_UPDATE_COMPANY_LOCATION = 'REQUEST_ADMIN_UPDATE_COMPANY_LOCATION'
export function requestAdminUpdateCompanyLocation (companyId, location, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_UPDATE_COMPANY_LOCATION, jwt, companyId, location, payload })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/locations/${encodeURIComponent(location)}`
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
          dispatch(receiveAdminUpdateCompanyLocation())
          return
        } else {
          dispatch(requestAdminUpdateCompanyLocationError())
          return Promise.reject(new Error('Failed to update company location'))
        }
      })
      .catch((err) => {
        console.error('Failed to update company', err)
        dispatch(requestAdminUpdateCompanyLocationError(new Error('Request to update company location failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_UPDATE_COMPANY_LOCATION = 'RECEIVE_ADMIN_UPDATE_COMPANY_LOCATION'
export function receiveAdminUpdateCompanyLocation () {
  return { type: RECEIVE_ADMIN_UPDATE_COMPANY_LOCATION }
}

export const REQUEST_ADMIN_UPDATE_COMPANY_LOCATION_ERROR = 'REQUEST_ADMIN_UPDATE_COMPANY_LOCATION_ERROR'
export function requestAdminUpdateCompanyLocationError (err) {
  return { type: REQUEST_ADMIN_UPDATE_COMPANY_LOCATION_ERROR, err }
}

export const REQUEST_ADMIN_CREATE_COMPANY_LOCATION = 'REQUEST_ADMIN_CREATE_COMPANY_LOCATION'
export function requestAdminCreateCompanyLocation (companyId, location) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_CREATE_COMPANY_LOCATION, jwt, companyId, location })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/locations/${location}`
    const opts = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    return fetch(url, opts)
      .then((res) => {
        if (res.ok) {
          dispatch(receiveAdminCreateCompanyLocation())
          return
        } else {
          dispatch(requestAdminCreateCompanyLocationError())
          return Promise.reject(new Error('Failed to create company location'))
        }
      })
      .catch((err) => {
        console.error('Failed to create company location', err)
        dispatch(requestAdminCreateCompanyLocationError(new Error('Request to create company location failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_CREATE_COMPANY_LOCATION = 'RECEIVE_ADMIN_CREATE_COMPANY_LOCATION'
export function receiveAdminCreateCompanyLocation () {
  return { type: RECEIVE_ADMIN_CREATE_COMPANY_LOCATION }
}

export const REQUEST_ADMIN_CREATE_COMPANY_LOCATION_ERROR = 'REQUEST_ADMIN_CREATE_COMPANY_LOCATION_ERROR'
export function requestAdminCreateCompanyLocationError (err) {
  return { type: REQUEST_ADMIN_CREATE_COMPANY_LOCATION_ERROR, err }
}

export const REQUEST_ADMIN_DELETE_COMPANY_LOCATION = 'REQUEST_ADMIN_DELETE_COMPANY_LOCATION'
export function requestAdminDeleteCompanyLocation (companyId, location) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_DELETE_COMPANY_LOCATION, jwt, companyId, location })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/locations/${encodeURIComponent(location)}`
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
          dispatch(receiveAdminDeleteCompanyLocation())
          return
        } else {
          dispatch(requestAdminDeleteCompanyLocationError())
          return Promise.reject(new Error('Failed to add delete location'))
        }
      })
      .catch((err) => {
        console.error('Failed to delete company location', err)
        dispatch(requestAdminDeleteCompanyLocationError(new Error('Request to delete company location failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_DELETE_COMPANY_LOCATION = 'RECEIVE_DELETE_COMPANY_LOCATION'
export function receiveAdminDeleteCompanyLocation () {
  return { type: RECEIVE_ADMIN_DELETE_COMPANY_LOCATION }
}

export const REQUEST_ADMIN_DELETE_COMPANY_LOCATION_ERROR = 'REQUEST_DELETE_COMPANY_LOCATION_ERROR'
export function requestAdminDeleteCompanyLocationError (err) {
  return { type: REQUEST_ADMIN_DELETE_COMPANY_LOCATION_ERROR, err }
}
