import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_TOKENS = 'REQUEST_COMPANY_TOKENS'
export function requestCompanyTokens (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_TOKENS, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/tokens`
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
            dispatch(receiveCompanyTokens(json))
            return json
          } else {
            dispatch(requestCompanyTokensError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company tokens'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company tokens', err)
        dispatch(requestCompanyTokensError(new Error('Request company tokens failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_COMPANY_TOKENS = 'RECEIVE_COMPANY_TOKENS'
export function receiveCompanyTokens (tokens) {
  return { type: RECEIVE_COMPANY_TOKENS, tokens }
}

export const REQUEST_COMPANY_TOKENS_ERROR = 'REQUEST_COMPANY_TOKENS_ERROR'
export function requestCompanyTokensError (err) {
  return { type: REQUEST_COMPANY_TOKENS_ERROR, err }
}

export const REQUEST_NEW_COMPANY_TOKEN = 'REQUEST_NEW_COMPANY_TOKEN'
export function requestNewCompanyToken (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_NEW_COMPANY_TOKEN, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/token`
    const opts = {
      method: 'POST',
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
            dispatch(receiveNewCompanyToken(json.token))
            return json
          } else {
            dispatch(requestNewCompanyTokenError(json))
            return Promise.reject(new Error(json.message || 'Failed to request new company token'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request new company token', err)
        dispatch(requestNewCompanyTokenError(new Error('Request new company token failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_NEW_COMPANY_TOKEN = 'RECEIVE_NEW_COMPANY_TOKEN'
export function receiveNewCompanyToken (token) {
  return { type: RECEIVE_NEW_COMPANY_TOKEN, token }
}

export const REQUEST_NEW_COMPANY_TOKEN_ERROR = 'REQUEST_NEW_COMPANY_TOKEN_ERROR'
export function requestNewCompanyTokenError (err) {
  return { type: REQUEST_NEW_COMPANY_TOKEN_ERROR, err }
}

export const REQUEST_REVOKE_COMPANY_TOKEN = 'REQUEST_REVOKE_COMPANY_TOKEN'
export function requestRevokeCompanyToken (companyId, token) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_REVOKE_COMPANY_TOKEN, jwt, token })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/token/${encodeURIComponent(token)}`
    const opts = {
      method: 'PATCH',
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
            dispatch(receiveRevokeCompanyToken(json.token))
            return json
          } else {
            dispatch(requestRevokeCompanyTokenError(json, token))
            return Promise.reject(new Error(json.message || 'Failed to invalidate token'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to invalidate company token', err)
        dispatch(requestRevokeCompanyTokenError(new Error('Request to invalidate company token failed'), token))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_REVOKE_COMPANY_TOKEN = 'RECEIVE_REVOKE_COMPANY_TOKEN'
export function receiveRevokeCompanyToken (token) {
  return { type: RECEIVE_REVOKE_COMPANY_TOKEN, token }
}

export const REQUEST_REVOKE_COMPANY_TOKEN_ERROR = 'REQUEST_REVOKE_COMPANY_TOKEN_ERROR'
export function requestRevokeCompanyTokenError (err, token) {
  return { type: REQUEST_REVOKE_COMPANY_TOKEN_ERROR, err, token }
}

export const REQUEST_VALIDATE_COMPANY_TOKEN = 'REQUEST_VALIDATE_COMPANY_TOKEN'
export function requestValidateCompanyToken (token) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_VALIDATE_COMPANY_TOKEN, jwt, token })

    const url = `${getState().config.apiUrl}/token/${encodeURIComponent(token)}/company`
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
            dispatch(receiveValidateCompanyToken(json))
            return json
          } else {
            dispatch(requestValidateCompanyTokenError(json))
            return Promise.reject(new Error(json.message || 'Failed to request company tokens'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request company tokens', err)
        dispatch(requestValidateCompanyTokenError(new Error('Request company tokens failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_VALIDATE_COMPANY_TOKEN = 'RECEIVE_VALIDATE_COMPANY_TOKEN'
export function receiveValidateCompanyToken (company) {
  return { type: RECEIVE_VALIDATE_COMPANY_TOKEN, company }
}

export const REQUEST_VALIDATE_COMPANY_TOKEN_ERROR = 'REQUEST_VALIDATE_COMPANY_TOKEN_ERROR'
export function requestValidateCompanyTokenError (err) {
  return { type: REQUEST_VALIDATE_COMPANY_TOKEN_ERROR, err }
}
