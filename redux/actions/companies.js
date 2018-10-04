import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANIES = 'REQUEST_COMPANIES'
export function requestCompanies () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_COMPANIES, jwt })

    const url = `${getState().config.apiUrl}/companies`
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
            dispatch(receiveCompanies(json))
            return json
          } else {
            dispatch(requestCompaniesError(json))
            return Promise.reject(new Error(json.message || 'Failed to request companies'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request companies', err)
        dispatch(requestCompaniesError(new Error('Request companies failed')))
        return Promise.reject(err)
      })
  }
}

export function requestAdminCompanies () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_COMPANIES, jwt })

    const url = `${getState().config.apiUrl}/admin/companies`
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
            ? dispatch(receiveCompanies(json))
            : dispatch(requestCompaniesError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request admin companies', err)
        return dispatch(requestCompaniesError(new Error('Request companies failed')))
      })
  }
}

export const RECEIVE_COMPANIES = 'RECEIVE_COMPANIES'
export function receiveCompanies (companies) {
  return { type: RECEIVE_COMPANIES, companies }
}

export const REQUEST_COMPANIES_ERROR = 'REQUEST_COMPANIES_ERROR'
export function requestCompaniesError (err) {
  return { type: REQUEST_COMPANIES_ERROR, err }
}

export function requestDeleteCompany (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/admin/company/${companyId}`
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
          ? dispatch(receiveDeleteCompany(companyId))
          : dispatch(requestDeleteCompanyError(res.statusText))
      })
      .catch((err) => {
        console.error('Failed to delete company', err)
        return dispatch(requestDeleteCompanyError(new Error('Delete company failed')))
      })
  }
}

export const RECEIVE_DELETE_COMPANY = 'RECEIVE_DELETE_COMPANY'
export function receiveDeleteCompany (companyId) {
  return { type: RECEIVE_DELETE_COMPANY, companyId }
}

export const REQUEST_DELETE_COMPANY_ERROR = 'REQUEST_DELETE_COMPANY_ERROR'
export function requestDeleteCompanyError (err) {
  return { type: REQUEST_DELETE_COMPANY_ERROR, err }
}
