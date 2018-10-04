import React from 'react'
import PropTypes from 'prop-types'
import CharityBucket from './bucket.jsx'

const CharityBuckets = ({ buckets, onEditBucket, onDeleteBucket }) => (
  <div className='table-responsive'>
    <table className='table table-fixed'>
      <thead>
        <tr>
          <th>Charity</th>
          <th style={{width: 100}}>Target</th>
          <th style={{width: 100}}>Total</th>
          <th style={{width: 125}}>Action</th>
        </tr>
      </thead>
      <tbody>
        {buckets.map((bucket) => (
          <CharityBucket bucket={bucket} onEdit={onEditBucket} onDelete={onDeleteBucket} key={bucket._id} />
        ))}
      </tbody>
    </table>
  </div>
)

CharityBuckets.propTypes = {
  buckets: PropTypes.array.isRequired,
  onEditBucket: PropTypes.func.isRequired,
  onDeleteBucket: PropTypes.func.isRequired
}

export default CharityBuckets
