import React from 'react'
import PropTypes from 'prop-types'
import CharityBucket from './bucket.jsx'

function CharityBuckets ({ buckets }) {
  return (
    <div className='row'>
      {buckets.map((bucket) => (
        <div className='col-sm-4' key={bucket._id}>
          <CharityBucket bucket={bucket} />
        </div>
      ))}
    </div>
  )
}

CharityBuckets.propTypes = {
  buckets: PropTypes.array.isRequired
}

export default CharityBuckets
