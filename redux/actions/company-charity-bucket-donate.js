import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_CHARITY_BUCKET_DONATE = 'REQUEST_COMPANY_CHARITY_BUCKET_DONATE'
export function requestCompanyCharityBucketDonate ({ companyId, bucketId }, { amount }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_CHARITY_BUCKET_DONATE, jwt, companyId, bucketId, amount })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/bucket/${encodeURIComponent(bucketId)}/donate`
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify({ amount })
    }

    return fetch(url, opts)
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) {
            dispatch(receiveCompanyCharityBucketDonateError(data))
            throw new Error(data.message || 'Failed to request company charity bucket donate')
          }

          dispatch(receiveCompanyCharityBucketDonate(data))
          return data
        })
      })
      .catch((err) => {
        console.error('Failed to request company charity bucket donate', err)
        dispatch(receiveCompanyCharityBucketDonateError(new Error('Request company charity bucket donate failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_CHARITY_BUCKET_DONATE = 'RECEIVE_COMPANY_CHARITY_BUCKET_DONATE'
export function receiveCompanyCharityBucketDonate ({ bucket, user }) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKET_DONATE, bucket, user }
}

export const RECEIVE_COMPANY_CHARITY_BUCKET_DONATE_ERROR = 'RECEIVE_COMPANY_CHARITY_BUCKET_DONATE_ERROR'
export function receiveCompanyCharityBucketDonateError (err) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKET_DONATE_ERROR, err }
}
