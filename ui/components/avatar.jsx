import React from 'react'
import uccdn from '../lib/uccdn.js'

export default function Avatar ({ user }) {
  const src = user.avatar || 'https://www.gravatar.com/avatar?d=mm&s=60'

  return (
    <div className='avatar-img'>
      <img src={uccdn(src, '-/scale_crop/60x60/center/-/quality/lighter/')} alt={user.firstName} />
    </div>
  )
}
