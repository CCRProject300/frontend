import React from 'react'

function Standings ({ standings }) {
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h3 className='panel-title'>My Overall Standings</h3>
      </div>
      <div className='panel-body p-a-0'>
        {standings.map((standing) => {
          return (
            <section key={standing.title} className='display-t text-center'>
              <div className='display-tc w-50 v-mid bg-gray-light line-height-1'>
                <div className='white font-xl'>#{standing.ranking}</div>
                <small className='white'>in {standing.title}</small>
              </div>
              <div className='display-tc w-50 v-mid gray-light p-y-2 line-height-1'>
                <small>You are in the top</small>
                <div className='font-xl count'>{standing.percent}%</div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default Standings
