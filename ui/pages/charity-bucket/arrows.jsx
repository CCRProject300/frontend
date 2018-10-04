import React from 'react'

const LeftArrow = ({ transform }) => (
  <svg viewBox='0 0 62 231' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinecap='round'>
      <polyline transform={transform} stroke='#FFFFFF' strokeWidth='8' points='57.0546875 4.23046875 4.5234375 115.832031 57.0546875 226.25'></polyline>
    </g>
  </svg>
)

const RightArrow = () => <LeftArrow transform='translate(30.789062, 115.240234) scale(-1, 1) translate(-30.789062, -115.240234)' />

export { LeftArrow, RightArrow }
