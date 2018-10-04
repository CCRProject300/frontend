import fetch from 'isomorphic-fetch'

export const REQUEST_DELETE_COMPANY_MEMBER = 'REQUEST_DELETE_COMPANY_MEMBER'
export function requestDeleteCompanyMember ({ companyId, userId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_DELETE_COMPANY_MEMBER, jwt, companyId, userId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/member/${encodeURIComponent(userId)}`
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
          dispatch(receiveDeleteCompanyMember({ companyId, userId }))
          return res
        } else {
          return res.json().then((json) => {
            dispatch(requestDeleteCompanyMemberError(json))
            return Promise.reject(new Error(json.message || 'Failed to delete company member'))
          })
        }
      })
      .catch((err) => {
        console.error('Failed to request delete company member', err)
        dispatch(requestDeleteCompanyMemberError(new Error('Request delete company member failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_DELETE_COMPANY_MEMBER = 'RECEIVE_DELETE_COMPANY_MEMBER'
export function receiveDeleteCompanyMember ({ companyId, userId }) {
  return { type: RECEIVE_DELETE_COMPANY_MEMBER, companyId, userId }
}

export const REQUEST_DELETE_COMPANY_MEMBER_ERROR = 'REQUEST_DELETE_COMPANY_MEMBER_ERROR'
export function requestDeleteCompanyMemberError (err) {
  return { type: REQUEST_DELETE_COMPANY_MEMBER_ERROR, err }
}
