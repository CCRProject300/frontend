import fetch from 'isomorphic-fetch'
import Auth0 from '../../lib/auth0'

export const SET_JWT = 'SET_JWT'
export function setJwt (jwt) {
  if (process.browser) {
    if (jwt) {
      window.localStorage.setItem('jwt', jwt)
    } else {
      window.localStorage.removeItem('jwt')
    }
  }

  return { type: SET_JWT, jwt }
}

export const SET_USER = 'SET_USER'
export function setUser (user) {
  if (process.browser) {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('user')
    }
  }

  return { type: SET_USER, user }
}

export const REQUEST_USER = 'REQUEST_USER'
export function requestUser () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_USER, jwt })

    const url = `${getState().config.apiUrl}/user`
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
            ? dispatch(receiveUser(json))
            : dispatch(requestUserError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request user', err)
        return dispatch(requestUserError(new Error('Request user failed')))
      })
  }
}

export const RECEIVE_USER = 'RECEIVE_USER'
export function receiveUser (user) {
  if (process.browser) {
    window.localStorage.setItem('user', JSON.stringify(user))
  }
  return { type: RECEIVE_USER, user }
}

export const REQUEST_USER_ERROR = 'REQUEST_USER_ERROR'
export function requestUserError (err) {
  return { type: REQUEST_USER_ERROR, err }
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export function requestLogin (credentials) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_LOGIN, credentials })

    const { config } = getState()

    return new Promise((resolve, reject) => {
      Auth0.get(config.auth0).login({
        connection: config.auth0.connection,
        email: credentials.email,
        password: credentials.password
      }, (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(res)
      })
    })
      .then((res) => {
        const jwt = res.idToken
        const url = `${getState().config.apiUrl}/user`
        const opts = {
          headers: {
            Authorization: jwt
          }
        }

        return fetch(url, opts)
          .then((res) => {
            return res.json().then((json) => {
              if (res.ok) {
                dispatch(receiveLogin({ jwt, user: json }))
                return { jwt, user: json }
              } else {
                dispatch(requestLoginError(json))
                return Promise.reject(new Error(json.message || 'Login failed'))
              }
            })
          })
      })
      .catch((err) => {
        console.error('Failed to request login', err)
        dispatch(requestLoginError(err))
        throw err
      })
  }
}

export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export function receiveLogin ({ jwt, user }) {
  if (process.browser) {
    window.localStorage.setItem('jwt', jwt)
    window.localStorage.setItem('user', JSON.stringify(user))
  }
  return { type: RECEIVE_LOGIN, jwt, user }
}

export const REQUEST_LOGIN_ERROR = 'REQUEST_LOGIN_ERROR'
export function requestLoginError (err) {
  return { type: REQUEST_LOGIN_ERROR, err }
}

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT'
export function requestLogout () {
  return (dispatch, getState) => {
    const auth0 = Auth0.get(getState().config.auth0)
    dispatch({ type: REQUEST_LOGOUT })
    setUser(null)
    setJwt(null)
    auth0.logout({
      returnTo: window.location.origin,
      clientID: getState().config.auth0.clientId
    })
  }
}

export const REQUEST_REGISTER = 'REQUEST_REGISTER'
export function requestRegister (data, token) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_REGISTER, data, token })
    const { config } = getState()
    const auth0 = Auth0.get(config.auth0)
    const { firstName, lastName, email, password } = data

    return new Promise((resolve, reject) => {
      auth0.signup({
        connection: config.auth0.connection,
        email,
        password,
        sso: true,
        popup: false,
        auto_login: false
      }, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
    .then(() => {
      // Store the registration data so it can be registered with the
      // KudosHealth API after login redirection
      const memo = {
        id: Math.random().toString(36).substr(2),
        data: { firstName, lastName, email },
        token
      }

      dispatch(receiveRegister({ memo }))

      // Login and redirect to /auth0/callback to complete registration
      auth0.login({
        connection: config.auth0.connection,
        email,
        password,
        // Pass the memo ID as state parameter so we know the redirect is valid
        state: JSON.stringify({ id: memo.id })
      })
    })
    .catch((err) => {
      console.error('Failed to request register', err)
      dispatch(requestRegisterError(err))
      throw err
    })
  }
}

export const RECEIVE_REGISTER = 'RECEIVE_REGISTER'
export function receiveRegister ({ memo }) {
  if (process.browser) {
    window.localStorage.setItem('registerMemo', JSON.stringify(memo))
  }
  return { type: RECEIVE_REGISTER, memo }
}

export const REQUEST_REGISTER_ERROR = 'REQUEST_REGISTER_ERROR'
export function requestRegisterError (err) {
  return { type: REQUEST_REGISTER_ERROR, err }
}

export const REQUEST_STARTED = 'REQUEST_STARTED'
export function requestStarted () {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_STARTED })

    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/user`
    const opts = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify({ started: true })
    }

    return fetch(url, opts)
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(new Error('Failed to mark user as started'))
        }
      })
      .catch((err) => {
        console.error('Failed to request user started', err)
        return Promise.reject(err)
      })
  }
}

export const REQUEST_CREATE_USER = 'REQUEST_CREATE_USER'
export function requestCreateUser (data, token) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_CREATE_USER, data, token })

    const { jwt, config } = getState()
    const url = `${config.apiUrl}/user${token ? `?token=${token}` : ''}`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(data)
    }

    return fetch(url, opts)
      .then((res) => {
        return res.json().then((json) => {
          if (res.ok) {
            dispatch(receiveCreateUser(json))
            return json
          }

          throw new Error(json.message || 'Failed to create user')
        })
      })
      .catch((err) => {
        console.error('Failed to create user', err)
        dispatch(requestCreateUserError(new Error('Failed to create user')))
        throw err
      })
  }
}

export const RECEIVE_CREATE_USER = 'RECEIVE_CREATE_USER'
export function receiveCreateUser (user) {
  if (process.browser) {
    window.localStorage.setItem('user', JSON.stringify(user))
  }
  return { type: RECEIVE_CREATE_USER, user }
}

export const REQUEST_CREATE_USER_ERROR = 'REQUEST_CREATE_USER_ERROR'
export function requestCreateUserError (err) {
  return { type: REQUEST_CREATE_USER_ERROR, err }
}

export const REQUEST_UPDATE_USER = 'REQUEST_UPDATE_USER'
export function requestUpdateUser (payload) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_UPDATE_USER, payload })

    const jwt = getState().jwt
    const url = `${getState().config.apiUrl}/user`
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
            dispatch(receiveUpdateUser(json))
          } else {
            dispatch(requestUpdateUserError(json))
            return Promise.reject(new Error(json.message || 'Update user failed'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to update user', err)
        dispatch(requestUpdateUserError(new Error('Failed to update user')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_UPDATE_USER = 'RECEIVE_UPDATE_USER'
export function receiveUpdateUser (user) {
  if (process.browser) {
    window.localStorage.setItem('user', JSON.stringify(user))
  }
  return { type: RECEIVE_UPDATE_USER, user }
}

export const REQUEST_UPDATE_USER_ERROR = 'REQUEST_UPDATE_USER_ERROR'
export function requestUpdateUserError (err) {
  return { type: REQUEST_UPDATE_USER_ERROR, err }
}
