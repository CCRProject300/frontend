import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_CREATE_COMPANY = 'REQUEST_ADMIN_CREATE_COMPANY'
export function requestAdminCreateCompany (payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_CREATE_COMPANY, jwt, payload })

    const url = `${getState().config.apiUrl}/admin/company`
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
            dispatch(receiveAdminCreateCompany(json))
            return json
          } else {
            dispatch(requestAdminCreateCompanyError(json))
            return Promise.reject(new Error(json.message || 'Failed to create company'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request admin create company', err)
        dispatch(requestAdminCreateCompanyError(new Error('Request admin create company failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_CREATE_COMPANY = 'RECEIVE_ADMIN_CREATE_COMPANY'
export function receiveAdminCreateCompany (user) {
  return { type: RECEIVE_ADMIN_CREATE_COMPANY, user }
}

export const REQUEST_ADMIN_CREATE_COMPANY_ERROR = 'REQUEST_ADMIN_CREATE_COMPANY_ERROR'
export function requestAdminCreateCompanyError (err) {
  return { type: REQUEST_ADMIN_CREATE_COMPANY_ERROR, err }
}

export const REQUEST_ADMIN_COMPANY = 'REQUEST_ADMIN_COMPANY'
export function requestAdminCompany (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_COMPANY, jwt, companyId })

    const url = `${getState().config.apiUrl}/admin/company/${encodeURIComponent(companyId)}`
    const opts = {
      method: 'GET',
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
            dispatch(receiveAdminCompany(json))
            return json
          } else {
            dispatch(requestAdminCompanyError(json))
            return Promise.reject(new Error(json.message || 'Failed to fetch company'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to fetch company', err)
        dispatch(requestAdminCompanyError(new Error('Request admin get company failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_COMPANY = 'RECEIVE_ADMIN_COMPANY'
export function receiveAdminCompany (company) {
  return { type: RECEIVE_ADMIN_COMPANY, company }
}

export const REQUEST_ADMIN_COMPANY_ERROR = 'REQUEST_ADMIN_COMPANY_ERROR'
export function requestAdminCompanyError (err) {
  return { type: REQUEST_ADMIN_COMPANY_ERROR, err }
}

export const REQUEST_ADMIN_UPDATE_COMPANY = 'REQUEST_ADMIN_UPDATE_COMPANY'
export function requestAdminUpdateCompany (id, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_UPDATE_COMPANY, jwt, payload })

    const url = `${getState().config.apiUrl}/admin/company/${id}`

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
        return res.json().then((data) => {
          if (!res.ok) {
            dispatch(requestAdminUpdateCompanyError(data))
            throw new Error('Failed to update company')
          }

          dispatch(receiveAdminUpdateCompany(data))
          return data
        })
      })
      .catch((err) => {
        dispatch(requestAdminUpdateCompanyError(new Error('Request admin update company failed')))
        throw err
      })
  }
}

export const RECEIVE_ADMIN_UPDATE_COMPANY = 'RECEIVE_ADMIN_UPDATE_COMPANY'
export function receiveAdminUpdateCompany (company) {
  return { type: RECEIVE_ADMIN_UPDATE_COMPANY, company }
}

export const REQUEST_ADMIN_COMPANY_UPDATE_ERROR = 'REQUEST_ADMIN_COMPANY_UPDATE_ERROR'
export function requestAdminUpdateCompanyError (err) {
  return { type: REQUEST_ADMIN_COMPANY_UPDATE_ERROR, err }
}
