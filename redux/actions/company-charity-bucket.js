import fetch from 'isomorphic-fetch'

export const REQUEST_COMPANY_CHARITY_BUCKET = 'REQUEST_COMPANY_CHARITY_BUCKET'
export function requestCompanyCharityBucket ({ companyId, bucketId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_COMPANY_CHARITY_BUCKET, companyId, bucketId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/bucket/${encodeURIComponent(bucketId)}`
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
            dispatch(receiveCompanyCharityBucketError(data))
            throw new Error(data.message || 'Failed to request company charity bucket')
          }

          dispatch(receiveCompanyCharityBucket(data))
          return data
        })
      })
      .catch((err) => {
        console.error('Failed to request company charity bucket', err)
        dispatch(receiveCompanyCharityBucketError(new Error('Request company charity bucket failed')))
        throw err
      })
  }
}

export const RECEIVE_COMPANY_CHARITY_BUCKET = 'RECEIVE_COMPANY_CHARITY_BUCKET'
export function receiveCompanyCharityBucket (bucket) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKET, bucket }
}

export const RECEIVE_COMPANY_CHARITY_BUCKET_ERROR = 'RECEIVE_COMPANY_CHARITY_BUCKET_ERROR'
export function receiveCompanyCharityBucketError (err) {
  return { type: RECEIVE_COMPANY_CHARITY_BUCKET_ERROR, err }
}

export const REQUEST_CREATE_COMPANY_CHARITY_BUCKET = 'REQUEST_CREATE_COMPANY_CHARITY_BUCKET'
export function requestCreateCompanyCharityBucket ({ companyId }, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_CREATE_COMPANY_CHARITY_BUCKET, companyId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/bucket`
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
            dispatch(requestCreateCompanyCharityBucketError(json))
            throw new Error(json.message || 'Failed to create company charity bucket')
          }

          dispatch(receiveCreateCompanyCharityBucket(json))
          return json
        })
      })
      .catch((err) => {
        console.error('Failed to request create company charity bucket', err)
        dispatch(requestCreateCompanyCharityBucketError(new Error('Request create company charity bucket failed')))
        throw err
      })
  }
}

export const RECEIVE_CREATE_COMPANY_CHARITY_BUCKET = 'RECEIVE_CREATE_COMPANY_CHARITY_BUCKET'
export function receiveCreateCompanyCharityBucket (bucket) {
  return { type: RECEIVE_CREATE_COMPANY_CHARITY_BUCKET, bucket }
}

export const REQUEST_CREATE_COMPANY_CHARITY_BUCKET_ERROR = 'REQUEST_CREATE_COMPANY_CHARITY_BUCKET_ERROR'
export function requestCreateCompanyCharityBucketError (err) {
  return { type: REQUEST_CREATE_COMPANY_CHARITY_BUCKET_ERROR, err }
}

export const REQUEST_UPDATE_COMPANY_CHARITY_BUCKET = 'REQUEST_UPDATE_COMPANY_CHARITY_BUCKET'
export function requestUpdateCompanyCharityBucket ({ companyId, bucketId }, payload) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_UPDATE_COMPANY_CHARITY_BUCKET, companyId, bucketId, payload })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/bucket/${encodeURIComponent(bucketId)}`
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
            dispatch(requestUpdateCompanyCharityBucketError(json))
            throw new Error(json.message || 'Failed to update company charity bucket')
          }

          dispatch(receiveUpdateCompanyCharityBucket(json))
          return json
        })
      })
      .catch((err) => {
        console.error('Failed to request update company charity bucket', err)
        dispatch(requestUpdateCompanyCharityBucketError(new Error('Request update company charity bucket failed')))
        throw err
      })
  }
}

export const RECEIVE_UPDATE_COMPANY_CHARITY_BUCKET = 'RECEIVE_UPDATE_COMPANY_CHARITY_BUCKET'
export function receiveUpdateCompanyCharityBucket (bucket) {
  return { type: RECEIVE_UPDATE_COMPANY_CHARITY_BUCKET, bucket }
}

export const REQUEST_UPDATE_COMPANY_CHARITY_BUCKET_ERROR = 'REQUEST_UPDATE_COMPANY_CHARITY_BUCKET_ERROR'
export function requestUpdateCompanyCharityBucketError (err) {
  return { type: REQUEST_UPDATE_COMPANY_CHARITY_BUCKET_ERROR, err }
}

export const REQUEST_DELETE_COMPANY_CHARITY_BUCKET = 'REQUEST_DELETE_COMPANY_CHARITY_BUCKET'
export function requestDeleteCompanyCharityBucket ({ companyId, bucketId }) {
  return (dispatch, getState) => {
    const jwt = getState().jwt

    dispatch({ type: REQUEST_DELETE_COMPANY_CHARITY_BUCKET, jwt, companyId, bucketId })

    const url = `${getState().config.apiUrl}/company/${encodeURIComponent(companyId)}/charity/bucket/${encodeURIComponent(bucketId)}`
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
            dispatch(requestDeleteCompanyCharityBucketError(json))
            throw new Error(json.message || 'Failed to delete company charity bucket')
          })
        }

        dispatch(receiveDeleteCompanyCharityBucket({ companyId, bucketId }))
      })
      .catch((err) => {
        console.error('Failed to request delete company charity bucket', err)
        dispatch(requestDeleteCompanyCharityBucketError(new Error('Request delete company charity bucket failed')))
        throw err
      })
  }
}

export const RECEIVE_DELETE_COMPANY_CHARITY_BUCKET = 'RECEIVE_DELETE_COMPANY_CHARITY_BUCKET'
export function receiveDeleteCompanyCharityBucket ({ companyId, bucketId }) {
  return { type: RECEIVE_DELETE_COMPANY_CHARITY_BUCKET, companyId, bucketId }
}

export const REQUEST_DELETE_COMPANY_CHARITY_BUCKET_ERROR = 'REQUEST_DELETE_COMPANY_CHARITY_BUCKET_ERROR'
export function requestDeleteCompanyCharityBucketError (err) {
  return { type: REQUEST_DELETE_COMPANY_CHARITY_BUCKET_ERROR, err }
}
