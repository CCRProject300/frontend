import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_SHOP_ITEMS = 'REQUEST_COMPANY_SHOP_ITEMS'
export function requestCompanyShopItems (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_SHOP_ITEMS, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/items`
    const opts = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    return fetch(url, opts)
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) {
            dispatch(receiveCompanyShopItemsError(data))
            throw new Error(data.message || 'Failed to request company shop items')
          }

          dispatch(receiveCompanyShopItems(data))
          return data
        })
      })
      .catch((err) => {
        console.error('Failed to request company shop items', err)
        dispatch(receiveCompanyShopItemsError(new Error('Request company shop items failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_SHOP_ITEMS = 'RECEIVE_COMPANY_SHOP_ITEMS'
export function receiveCompanyShopItems (items) {
  return { type: RECEIVE_COMPANY_SHOP_ITEMS, items }
}

export const RECEIVE_COMPANY_SHOP_ITEMS_ERROR = 'RECEIVE_COMPANY_SHOP_ITEMS_ERROR'
export function receiveCompanyShopItemsError (err) {
  return { type: RECEIVE_COMPANY_SHOP_ITEMS_ERROR, err }
}
