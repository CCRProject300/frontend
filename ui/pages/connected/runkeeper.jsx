import React from 'react'
import Helmet from 'react-helmet'
import Connected from './connected.jsx'

export default function () {
  return (
    <section className='wrapper'>
      <Helmet htmlAttributes={{ class: 'connected-runkeeper' }} />
      <h1 className='m-b-2'>
        <img src='/imgs/apps/runkeeper.png' className='m-r-2' style={{height: 46}} />
        Runkeeper
      </h1>
      <Connected loading={false} strategy='runkeeper' />
    </section>
  )
}
