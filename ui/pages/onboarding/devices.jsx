import React from 'react'
import Device from '../../components/device.jsx'
import { Link } from 'react-router'

export default ({ user, onUpdateUser }) => {
  const canProgress = user && user.methods && user.methods.length

  return (
    <section className='panel panel-default'>
      <div className='panel-body text-left p-x-3'>
        <div className='text-center'>
          <img src='/imgs/icon-152x152.png' className='d-inline-block' width='100' />
        </div>
        <p className='lead m-y-3'>
          To score KudosPoints, you need to connect at least one application to your KudosHealth account.
          <Link to='/faq#whatapplicationsandwearabledevicescaniconnectonkudoshealth?' target='_blank'> Find out more here.</Link>
        </p>
        <Device user={user} app='fitbit' />
        <Device user={user} app='google-fit' />
        <Device user={user} app='runkeeper' />
        <Device user={user} app='strava' />
        <div className='text-center m-t-3'>
          <button className='btn btn-lg btn-warning' disabled={!canProgress} onClick={() => onUpdateUser(Promise.resolve())}>Next</button>
        </div>
      </div>
    </section>
  )
}
