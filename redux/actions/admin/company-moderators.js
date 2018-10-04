import fetch from 'isomorphic-fetch'

export const REQUEST_ADMIN_CREATE_COMPANY_MODERATORS = 'REQUEST_ADMIN_CREATE_COMPANY_MODERATORS'
export function requestAdminCreateCompanyModerators ({ companyId, payload }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_ADMIN_CREATE_COMPANY_MODERATORS, jwt, companyId, payload })

    const url = `${getState().config.apiUrl}/admin/company/${encodeURIComponent(companyId)}/moderators`
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
            dispatch(receiveAdminCreateCompanyModerators(json))
            return json
          } else {
            dispatch(requestAdminCreateCompanyModeratorsError(json))
            return Promise.reject(json)
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request create company moderators', err)
        dispatch(requestAdminCreateCompanyModeratorsError(new Error('Request create company moderators failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_ADMIN_CREATE_COMPANY_MODERATORS = 'RECEIVE_ADMIN_CREATE_COMPANY_MODERATORS'
export function receiveAdminCreateCompanyModerators (user) {
  return { type: RECEIVE_ADMIN_CREATE_COMPANY_MODERATORS, user }
}

export const REQUEST_ADMIN_CREATE_COMPANY_MODERATORS_ERROR = 'REQUEST_ADMIN_CREATE_COMPANY_MODERATORS_ERROR'
export function requestAdminCreateCompanyModeratorsError (err) {
  return { type: REQUEST_ADMIN_CREATE_COMPANY_MODERATORS_ERROR, err }
}
