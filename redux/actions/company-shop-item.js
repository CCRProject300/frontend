import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_SHOP_ITEM = 'REQUEST_COMPANY_SHOP_ITEM'
export function requestCompanyShopItem ({ companyId, itemId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_SHOP_ITEM, companyId, itemId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/item/${encodeURIComponent(itemId)}`
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
            dispatch(receiveCompanyShopItemError(data))
            throw new Error(data.message || 'Failed to request company shop item')
          }

          dispatch(receiveCompanyShopItem(data))
          return data
        })
      })
      .catch((err) => {
        console.error('Failed to request company shop item', err)
        dispatch(receiveCompanyShopItemError(new Error('Request company shop item failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_SHOP_ITEM = 'RECEIVE_COMPANY_SHOP_ITEM'
export function receiveCompanyShopItem (item) {
  return { type: RECEIVE_COMPANY_SHOP_ITEM, item }
}

export const RECEIVE_COMPANY_SHOP_ITEM_ERROR = 'RECEIVE_COMPANY_SHOP_ITEM_ERROR'
export function receiveCompanyShopItemError (err) {
  return { type: RECEIVE_COMPANY_SHOP_ITEM_ERROR, err }
}

export const REQUEST_CREATE_COMPANY_SHOP_ITEM = 'REQUEST_CREATE_COMPANY_SHOP_ITEM'
export function requestCreateCompanyShopItem ({ companyId }, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_COMPANY_SHOP_ITEM, companyId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/item`
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
          if (!res.ok) {
            dispatch(requestCreateCompanyShopItemError(json))
            throw new Error(json.message || 'Failed to create company shop item')
          }

          dispatch(receiveCreateCompanyShopItem(json))
          return json
        })
      })
      .catch((err) => {
        console.error('Failed to request create company shop item', err)
        dispatch(requestCreateCompanyShopItemError(new Error('Request create company shop item failed')))
        throw err
      })
  }
}

export const RECEIVE_CREATE_COMPANY_SHOP_ITEM = 'RECEIVE_CREATE_COMPANY_SHOP_ITEM'
export function receiveCreateCompanyShopItem (item) {
  return { type: RECEIVE_CREATE_COMPANY_SHOP_ITEM, item }
}

export const REQUEST_CREATE_COMPANY_SHOP_ITEM_ERROR = 'REQUEST_CREATE_COMPANY_SHOP_ITEM_ERROR'
export function requestCreateCompanyShopItemError (err) {
  return { type: REQUEST_CREATE_COMPANY_SHOP_ITEM_ERROR, err }
}

export const REQUEST_UPDATE_COMPANY_SHOP_ITEM = 'REQUEST_UPDATE_COMPANY_SHOP_ITEM'
export function requestUpdateCompanyShopItem ({ companyId, itemId }, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_UPDATE_COMPANY_SHOP_ITEM, companyId, itemId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/item/${encodeURIComponent(itemId)}`
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
          if (!res.ok) {
            dispatch(requestUpdateCompanyShopItemError(json))
            throw new Error(json.message || 'Failed to update company shop item')
          }

          dispatch(receiveUpdateCompanyShopItem(json))
          return json
        })
      })
      .catch((err) => {
        console.error('Failed to request update company shop item', err)
        dispatch(requestUpdateCompanyShopItemError(new Error('Request update company shop item failed')))
        throw err
      })
  }
}

export const RECEIVE_UPDATE_COMPANY_SHOP_ITEM = 'RECEIVE_UPDATE_COMPANY_SHOP_ITEM'
export function receiveUpdateCompanyShopItem (item) {
  return { type: RECEIVE_UPDATE_COMPANY_SHOP_ITEM, item }
}

export const REQUEST_UPDATE_COMPANY_SHOP_ITEM_ERROR = 'REQUEST_UPDATE_COMPANY_SHOP_ITEM_ERROR'
export function requestUpdateCompanyShopItemError (err) {
  return { type: REQUEST_UPDATE_COMPANY_SHOP_ITEM_ERROR, err }
}

export const REQUEST_DELETE_COMPANY_SHOP_ITEM = 'REQUEST_DELETE_COMPANY_SHOP_ITEM'
export function requestDeleteCompanyShopItem ({ companyId, itemId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_DELETE_COMPANY_SHOP_ITEM, jwt, companyId, itemId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/shop/item/${encodeURIComponent(itemId)}`
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
        if (!res.ok) {
          return res.json().then((json) => {
            dispatch(requestDeleteCompanyShopItemError(json))
            throw new Error(json.message || 'Failed to delete company shop item')
          })
        }

        dispatch(receiveDeleteCompanyShopItem({ companyId, itemId }))
      })
      .catch((err) => {
        console.error('Failed to request delete company shop item', err)
        dispatch(requestDeleteCompanyShopItemError(new Error('Request delete company shop item failed')))
        throw err
      })
  }
}

export const RECEIVE_DELETE_COMPANY_SHOP_ITEM = 'RECEIVE_DELETE_COMPANY_SHOP_ITEM'
export function receiveDeleteCompanyShopItem ({ companyId, itemId }) {
  return { type: RECEIVE_DELETE_COMPANY_SHOP_ITEM, companyId, itemId }
}

export const REQUEST_DELETE_COMPANY_SHOP_ITEM_ERROR = 'REQUEST_DELETE_COMPANY_SHOP_ITEM_ERROR'
export function requestDeleteCompanyShopItemError (err) {
  return { type: REQUEST_DELETE_COMPANY_SHOP_ITEM_ERROR, err }
}
