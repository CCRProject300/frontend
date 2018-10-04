import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_CHARITY_BUCKETS = 'REQUEST_COMPANY_CHARITY_BUCKETS'
export function requestCompanyCharityBuckets (companyId) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_CHARITY_BUCKETS, jwt, companyId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/buckets`
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
            dispatch(receiveCompanyCharityBucketsError(data))
            throw new Error(data.message || 'Failed to request company charity buckets')
          }

          dispatch(receiveCompanyCharityBuckets(data))
          return data
        })
      })
      .catch((err) => {
        console.error('Failed to request company charity buckets', err)
        dispatch(receiveCompanyCharityBucketsError(new Error('Request company charity buckets failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_CHARITY_BUCKETS = 'RECEIVE_COMPANY_CHARITY_BUCKETS'
export function receiveCompanyCharityBuckets (buckets) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKETS, buckets }
}

export const RECEIVE_COMPANY_CHARITY_BUCKETS_ERROR = 'RECEIVE_COMPANY_CHARITY_BUCKETS_ERROR'
export function receiveCompanyCharityBucketsError (err) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKETS_ERROR, err }
}
