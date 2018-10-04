import React from 'react'

export default function () {
  return (
    <footer id='footer' className='bg-primary p-y-1' style={{ margin: '0 -15px' }}>
      <div className='text-center'>
        <a href='#' className='pull-right white'>
          <i className='fa fa-angle-up'></i>
        </a>
        <small>&copy; {new Date().getFullYear()} KudosHealth.</small>
      </div>
    </footer>
  )
}
