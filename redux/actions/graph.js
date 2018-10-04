import fetch from 'isomorphic-fetch'

export const REQUEST_GRAPH = 'REQUEST_GRAPH'
export function requestGraph ({ timespan, startDate, strategy }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_GRAPH, jwt })

    let qs = []

    if (timespan) qs.push(`timespan=${encodeURIComponent(timespan)}`)
    if (startDate) qs.push(`startDate=${encodeURIComponent(startDate)}`)
    if (strategy) qs.push(`strategy=${encodeURIComponent(strategy)}`)

    qs = qs.length ? '?' + qs.join('&') : ''

    const url = `${getState().config.apiUrl}/graph${qs}`
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
            dispatch(receiveGraph(json))
            return json
          } else {
            dispatch(requestGraphError(json))
            return Promise.reject(new Error(json.message || 'Failed to request graph'))
          }
        })
      })
      .catch((err) => {
        console.error('Failed to request graph', err)
        dispatch(requestGraphError(new Error('Request graph failed')))
        return Promise.reject(err)
      })
  }
}

export const RECEIVE_GRAPH = 'RECEIVE_GRAPH'
export function receiveGraph (graph) {
  return { type: RECEIVE_GRAPH, graph }
}

export const REQUEST_GRAPH_ERROR = 'REQUEST_GRAPH_ERROR'
export function requestGraphError (err) {
  return { type: REQUEST_GRAPH_ERROR, err }
}
