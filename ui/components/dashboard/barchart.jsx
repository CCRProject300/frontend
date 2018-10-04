import React from 'react'
import ChartistGraph from 'react-chartist'

function BarChart ({ data }) {
  return (
    <ChartistGraph data={data} type='Bar' />
  )
}

export default BarChart
