import React from 'react'

function Podium ({ title, podium }) {
  if (!podium || podium.length < 3) return null
  const images = podium.map((p) => (p.image || 'https://www.gravatar.com/avatar?d=mm&s=200'))
  return (
    <div className='podium'>
      <label className='podium-title position-a r-1'>{title}</label>
      <div className='podium-bars'>
        <div className='podium-bar silver'>
          <div className='podium-image' style={{ backgroundImage: `url(${images[1]})` }}></div>
          <div className='podium-text'>
            <div className='score'>{Math.round(podium[1].kudosPoints)}</div>
            <div className='name'>{podium[1].name}</div>
          </div>
        </div>
        <div className='podium-bar gold'>
          <div className='podium-image' style={{ backgroundImage: `url(${images[0]})` }}></div>
          <div className='podium-text'>
            <div className='score'>{Math.round(podium[0].kudosPoints)}</div>
            <div className='name'>{podium[0].name}</div>
          </div>
        </div>
        <div className='podium-bar bronze'>
          <div className='podium-image' style={{ backgroundImage: `url(${images[2]})` }}></div>
          <div className='podium-text'>
            <div className='score'>{Math.round(podium[2].kudosPoints)}</div>
            <div className='name'>{podium[2].name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Podium
