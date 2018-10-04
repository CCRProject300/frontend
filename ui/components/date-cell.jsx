import React from 'react'

export default function ({ date }) {
  if (!date) {
    return (
      <div className='full-size flex column centered-text'>
        <div className='flex centered'>
          Not activated
        </div>
      </div>
    )
  }
  return (
    <div className='full-size flex column date'>
      <div className='flex centered'>
        {date.format('MMMM')}
      </div>
      <div className='flex centered'>
        {date.format('D')}
      </div>
    </div>
  )
}
