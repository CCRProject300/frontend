import React from 'react'

const Legend = ({legend, seriesColors}) =>
  <div style={{margin: '0 5px', float: 'right', textAlign: 'right'}}>
    {legend && legend.map((legendText, i) => {
      return (
        <div key={legendText}>
          {legendText}
          <div style={{
            backgroundColor: seriesColors[i],
            border: '1px solid #fff',
            display: 'inline-block',
            width: 15,
            height: 15,
            verticalAlign: '-3px'
          }} />
        </div>
      )
    })}
  </div>

export default Legend
