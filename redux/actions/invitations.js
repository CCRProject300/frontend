import fetch from 'isomorphic-fetch'
import { addPopTartMsg } from './popmsgs'
import { requestUser } from './user'
import { requestNotifications } from './notifications'
import { requestCompanies } from './companies'

export const REQUEST_REPLY_TO_INVITATION = 'REQUEST_REPLY_TO_INVITATION'
export function requestReplyToInvitation (details) {
  return (dispatch, getState) => {
    const jwt = getState().jwt
    const payload = { accepted: details.accepted }
    if (details.panelId) payload.panelId = details.panelId

    const url = `${getState().config.apiUrl}${details.url}`
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
        if (res.ok) {
          if (details.accepted) {
            // Inform user of success and sync stored user object and companies with DB
            dispatch(addPopTartMsg({ level: 'success', message: 'Group joined' }))
            dispatch(requestUser())
            dispatch(requestCompanies())
          }
          dispatch(requestNotifications())
          dispatch({ type: RECEIVE_REPLY_TO_INVITATION, url: details.url })
          return true
        }
        return Promise.reject(new Error(`Failed to respond to invitation: ${res.statusText}`))
      })
      .catch((err) => {
        console.error(err)
        dispatch(addPopTartMsg({ level: 'error', message: err.message }))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_REPLY_TO_INVITATION = 'RECEIVE_REPLY_TO_INVITATION'
export function receiveReplyToInvitation (url) {
  return { type: RECEIVE_REPLY_TO_INVITATION, url }
}
