import React from 'react'

export default function ({ title, messages, height }) {
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h3 className='panel-title'>{title}</h3>
      </div>
      <div className='panel-body no-data' style={{ height: height || 'auto' }}>
        {messages.map((m, ind) => <p key={ind}>{m}</p>)}
      </div>
    </div>
  )
}
