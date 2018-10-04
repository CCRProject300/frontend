import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT = 'REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT'
export function requestAdminUpdateCompanyDepartment (companyId, department, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT, jwt, companyId, department, payload })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/departments/${encodeURIComponent(department)}`
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
          dispatch(receiveAdminUpdateCompanyDepartment())
          return
        } else {
          dispatch(requestAdminUpdateCompanyDepartmentError())
          return Promise.reject(new Error('Failed to update company department'))
        }
      })
      .catch((err) => {
        console.error('Failed to update company department', err)
        dispatch(requestAdminUpdateCompanyDepartmentError(new Error('Request to update company department failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_UPDATE_COMPANY_DEPARTMENT = 'RECEIVE_ADMIN_UPDATE_COMPANY_DEPARTMENT'
export function receiveAdminUpdateCompanyDepartment () {
  return { type: RECEIVE_ADMIN_UPDATE_COMPANY_DEPARTMENT }
}

export const REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT_ERROR = 'REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT_ERROR'
export function requestAdminUpdateCompanyDepartmentError (err) {
  return { type: REQUEST_ADMIN_UPDATE_COMPANY_DEPARTMENT_ERROR, err }
}

export const REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT = 'REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT'
export function requestAdminCreateCompanyDepartment (companyId, department) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT, jwt, companyId, department })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/departments/${encodeURIComponent(department)}`
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
          dispatch(receiveAdminCreateCompanyDepartment())
          return
        } else {
          dispatch(requestAdminCreateCompanyDepartmentError())
          return Promise.reject(new Error('Failed to add company department'))
        }
      })
      .catch((err) => {
        console.error('Failed to add company department', err)
        dispatch(requestAdminCreateCompanyDepartmentError(new Error('Request to add company department failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_CREATE_COMPANY_DEPARTMENT = 'RECEIVE_ADMIN_CREATE_COMPANY_DEPARTMENT'
export function receiveAdminCreateCompanyDepartment () {
  return { type: RECEIVE_ADMIN_CREATE_COMPANY_DEPARTMENT }
}

export const REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT_ERROR = 'REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT_ERROR'
export function requestAdminCreateCompanyDepartmentError (err) {
  return { type: REQUEST_ADMIN_CREATE_COMPANY_DEPARTMENT_ERROR, err }
}

export const REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT = 'REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT'
export function requestAdminDeleteCompanyDepartment (companyId, department) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT, jwt, companyId, department })
    const url = `${getState().config.apiUrl}/admin/company/${companyId}/departments/${encodeURIComponent(department)}`
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
          dispatch(receiveAdminDeleteCompanyDepartment())
          return
        } else {
          dispatch(requestAdminDeleteCompanyDepartmentError())
          return Promise.reject(new Error('Failed to delete department'))
        }
      })
      .catch((err) => {
        console.error('Failed to delete company department', err)
        dispatch(requestAdminDeleteCompanyDepartmentError(new Error('Request to delete company department failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_DELETE_COMPANY_DEPARTMENT = 'RECEIVE_ADMIN_DELETE_COMPANY_DEPARTMENT'
export function receiveAdminDeleteCompanyDepartment () {
  return { type: RECEIVE_ADMIN_DELETE_COMPANY_DEPARTMENT }
}

export const REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT_ERROR = 'REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT_ERROR'
export function requestAdminDeleteCompanyDepartmentError (err) {
  return { type: REQUEST_ADMIN_DELETE_COMPANY_DEPARTMENT_ERROR, err }
}
