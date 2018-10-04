import fetch from 'isomorphic-fetch'

export const REQUEST_NOTIFICATIONS = 'REQUEST_NOTIFICATIONS'
export function requestNotifications () {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_NOTIFICATIONS, jwt })

    const url = `${getState().config.apiUrl}/notifications`
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
            ? dispatch(receiveNotifications(json))
            : dispatch(requestNotificationsError(json))
        })
      })
      .catch((err) => {
        console.error('Failed to request notifications', err)
        return dispatch(requestNotificationsError(new Error('Request user failed')))
      })
  }
}

export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS'
export function receiveNotifications (notifications) {
  return { type: RECEIVE_NOTIFICATIONS, notifications }
}

export const REQUEST_NOTIFICATIONS_ERROR = 'REQUEST_NOTIFICATIONS_ERROR'
export function requestNotificationsError (err) {
  return { type: REQUEST_NOTIFICATIONS_ERROR, err }
}

export const REQUEST_CONFIRM_NOTIFICATION = 'REQUEST_CONFIRM_NOTIFICATION'
export function requestConfirmNotification (notification, data) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_CONFIRM_NOTIFICATION, notification })

    const url = `${getState().config.apiUrl}/notifications/${notification._id}/confirm`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }
    if (data) opts.body = JSON.stringify({ data })

    return fetch(url, opts)
      .then((res) => {
        if (!res.ok) {
          console.error('Failed to confirm notification')
          return dispatch(requestConfirmNotificationError(notification))
        }
        dispatch(receiveConfirmNotification(notification))
      })
      .catch((err) => {
        console.error('Failed to confirm notification', err)
        return dispatch(requestConfirmNotificationError(notification, new Error('Request to confirm notification failed')))
      })
  }
}

export const RECEIVE_CONFIRM_NOTIFICATION = 'RECEIVE_CONFIRM_NOTIFICATION'
export function receiveConfirmNotification (notification) {
  return { type: RECEIVE_CONFIRM_NOTIFICATION, notification }
}

export const REQUEST_CONFIRM_NOTIFICATION_ERROR = 'REQUEST_CONFIRM_NOTIFICATION_ERROR'
export function requestConfirmNotificationError (notification, err) {
  return { type: REQUEST_CONFIRM_NOTIFICATION_ERROR, notification, err }
}

export const REQUEST_REJECT_NOTIFICATION = 'REQUEST_REJECT_NOTIFICATION'
export function requestRejectNotification (notification, data) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    dispatch({ type: REQUEST_REJECT_NOTIFICATION, notification })

    const url = `${getState().config.apiUrl}/notifications/${notification._id}/reject`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }
    if (data) opts.body = JSON.stringify({ data })

    return fetch(url, opts)
      .then((res) => {
        if (!res.ok) {
          console.error('Failed to reject notification')
          return dispatch(requestRejectNotificationError(notification))
        }
        dispatch(receiveRejectNotification(notification))
      })
      .catch((err) => {
        console.error('Failed to reject notification', err)
        return dispatch(requestRejectNotificationError(notification, new Error('Request to reject notification failed')))
      })
  }
}

export const RECEIVE_REJECT_NOTIFICATION = 'RECEIVE_REJECT_NOTIFICATION'
export function receiveRejectNotification (notification) {
  return { type: RECEIVE_REJECT_NOTIFICATION, notification }
}

export const REQUEST_REJECT_NOTIFICATION_ERROR = 'REQUEST_REJECT_NOTIFICATION_ERROR'
export function requestRejectNotificationError (notification, err) {
  return { type: REQUEST_REJECT_NOTIFICATION_ERROR, notification, err }
}
