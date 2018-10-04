import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_MEMBERS = 'REQUEST_COMPANY_MEMBERS'
export function requestCompanyMembers (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_MEMBERS, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/members`
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
            dispatch(receiveCompanyMembers(json))
            return json
          } else {
            dispatch(requestCompanyMembersError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company members'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company members', err)
        dispatch(requestCompanyMembersError(new Error('Request company members failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_MEMBERS = 'RECEIVE_COMPANY_MEMBERS'
export function receiveCompanyMembers (members) {
  return { type: RECEIVE_COMPANY_MEMBERS, members }
}

export const REQUEST_COMPANY_MEMBERS_ERROR = 'REQUEST_COMPANY_MEMBERS_ERROR'
export function requestCompanyMembersError (err) {
  return { type: REQUEST_COMPANY_MEMBERS_ERROR, err }
}

export const REQUEST_CREATE_COMPANY_MEMBERS = 'REQUEST_CREATE_COMPANY_MEMBERS'
export function requestCreateCompanyMembers ({ companyId, payload }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_COMPANY_MEMBERS, jwt, companyId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/members`
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
            dispatch(receiveCreateCompanyMembers(json))
            return json
          } else {
            dispatch(requestCreateCompanyMembersError(json))
            return Promise.reject(new Error(json.message || 'Failed to create company members'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request create company members', err)
        dispatch(requestCreateCompanyMembersError(new Error('Request create company members failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_CREATE_COMPANY_MEMBERS = 'RECEIVE_CREATE_COMPANY_MEMBERS'
export function receiveCreateCompanyMembers (members) {
  return { type: RECEIVE_CREATE_COMPANY_MEMBERS, members }
}

export const REQUEST_CREATE_COMPANY_MEMBERS_ERROR = 'REQUEST_CREATE_COMPANY_MEMBERS_ERROR'
export function requestCreateCompanyMembersError (err) {
  return { type: REQUEST_CREATE_COMPANY_MEMBERS_ERROR, err }
}
