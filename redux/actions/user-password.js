import Auth0 from '../../lib/auth0'

export const REQUEST_USER_PASSWORD_FORGOT = 'REQUEST_USER_PASSWORD_FORGOT'
export function requestUserPasswordForgot (email) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_USER_PASSWORD_FORGOT, email })

    const { config } = getState()
    const auth0 = Auth0.get(config.auth0)

    return new Promise((resolve, reject) => {
      auth0.changePassword({
        connection: config.auth0.connection,
        email
      }, (err) => {
        if (err) {
          console.error('Failed to request user password forgot', err)
          dispatch(requestUserPasswordForgotError(err))
          return reject(err)
        }

        dispatch(receiveUserPasswordForgot())
        resolve()
      })
    })
  }
}

export const RECEIVE_USER_PASSWORD_FORGOT = 'RECEIVE_USER_PASSWORD_FORGOT'
export function receiveUserPasswordForgot () {
  return { type: RECEIVE_USER_PASSWORD_FORGOT }
}

export const REQUEST_USER_PASSWORD_FORGOT_ERROR = 'REQUEST_USER_PASSWORD_FORGOT_ERROR'
export function requestUserPasswordForgotError (err) {
  return { type: REQUEST_USER_PASSWORD_FORGOT_ERROR, err }
}
