import fetch from 'isomorphic-fetch'

export const REQUEST_CREATE_LEAGUE_MEMBERS = 'REQUEST_CREATE_LEAGUE_MEMBERS'
export function requestCreateLeagueMembers ({ leagueId, payload, invite = true }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_LEAGUE_MEMBERS, jwt, leagueId, payload, invite })

    const url = `${getState().config.apiUrl}/league/${encodeURIComponent(leagueId)}/members${invite ? '/invite' : ''}`

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
            dispatch(receiveCreateLeagueMembers(json))
            return json
          } else {
            dispatch(requestCreateLeagueMembersError(json))
            return Promise.reject(new Error(json.message || 'Failed to create league members'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request create league members', err)
        dispatch(requestCreateLeagueMembersError(new Error('Request create league members failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_CREATE_LEAGUE_MEMBERS = 'RECEIVE_CREATE_LEAGUE_MEMBERS'
export function receiveCreateLeagueMembers (members) {
  return { type: RECEIVE_CREATE_LEAGUE_MEMBERS, members }
}

export const REQUEST_CREATE_LEAGUE_MEMBERS_ERROR = 'REQUEST_CREATE_LEAGUE_MEMBERS_ERROR'
export function requestCreateLeagueMembersError (err) {
  return { type: REQUEST_CREATE_LEAGUE_MEMBERS_ERROR, err }
}
