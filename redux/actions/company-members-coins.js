import fetch from 'isomorphic-fetch'

export const REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS = 'REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS'
export function requestDistributeCompanyMembersCoins ({ companyId, userIds, kudosCoins, reason }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS, jwt, companyId, userIds, kudosCoins, reason })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/members/coins`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify({
        userIds,
        kudosCoins,
        reason
      })
    }

    return fetch(url, opts)
      .then((res) => {
        if (res.ok) {
          dispatch(receiveDistributeCompanyMembersCoins({ companyId, userIds, kudosCoins, reason }))
          return res
        } else {
          return res.json().then((json) => {
            dispatch(requestDistributeCompanyMembersCoinsError(json))
            return Promise.reject(new Error(json.message || 'Failed to distribute KudosCoins'))
          })
        }
      })
      .catch((err) => {
        console.error('Failed to request distribute KudosCoins', err)
        dispatch(requestDistributeCompanyMembersCoinsError(new Error('Request distribute KudosCoins failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_DISTRIBUTE_COMPANY_MEMBERS_COINS = 'RECEIVE_DISTRIBUTE_COMPANY_MEMBERS_COINS'
export function receiveDistributeCompanyMembersCoins ({ companyId, userId }) {
  return { type: RECEIVE_DISTRIBUTE_COMPANY_MEMBERS_COINS, companyId, userId }
}

export const REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS_ERROR = 'REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS_ERROR'
export function requestDistributeCompanyMembersCoinsError (err) {
  return { type: REQUEST_DISTRIBUTE_COMPANY_MEMBERS_COINS_ERROR, err }
}
