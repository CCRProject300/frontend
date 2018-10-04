import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_SHOP_ITEM_BUY = 'REQUEST_COMPANY_SHOP_ITEM_BUY'
export function requestCompanyShopItemBuy (companyId, itemId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_SHOP_ITEM_BUY, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/item/${encodeURIComponent(itemId)}/buy`
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
        return res.json().then((data) => {
          if (!res.ok) {
            dispatch(receiveCompanyShopItemBuyError(data))
            throw new Error(data.message || 'Failed to request company shop item buy')
          }

          dispatch(receiveCompanyShopItemBuy(data))
        })
      })
      .catch((err) => {
        console.error('Failed to request company shop item buy', err)
        dispatch(receiveCompanyShopItemBuyError(new Error('Request company shop item buy failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_SHOP_ITEM_BUY = 'RECEIVE_COMPANY_SHOP_ITEM_BUY'
export function receiveCompanyShopItemBuy ({ item, user }) {
  return { type: RECEIVE_COMPANY_SHOP_ITEM_BUY, item, user }
}

export const RECEIVE_COMPANY_SHOP_ITEM_BUY_ERROR = 'RECEIVE_COMPANY_SHOP_ITEM_BUY_ERROR'
export function receiveCompanyShopItemBuyError (err) {
  return { type: RECEIVE_COMPANY_SHOP_ITEM_BUY_ERROR, err }
}
