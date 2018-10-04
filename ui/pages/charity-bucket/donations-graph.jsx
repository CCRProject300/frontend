import React from 'react'
import PropTypes from 'prop-types'
import ChartistGraph from 'react-chartist'
import chroma from 'chroma-js'
import formatNumber from 'simple-format-number'
import ChartistTooltip from '../../lib/chartist-tooltip'

const chromaScale = chroma.scale(['#003247', '#009ee0'])

const DonationsGraph = ({ donations, target, total }) => {
  const seriesColors = chromaScale.colors(donations.length)

  const data = {
    labels: ['KudosCoins Donated'],
    series: donations.map((d, i) => {
      const formattedAmount = formatNumber(d.amount, { fractionDigits: 0 })
      return [{
        value: d.amount,
        meta: `${d.user.firstName} ${d.user.lastName}: ${formattedAmount} KudosCoins`,
        color: seriesColors[i]
      }]
    })
  }

  const shortfall = Math.max(0, target - total)
  data.series.push([{ value: shortfall }])

  const options = {
    stackBars: true,
    fullWidth: true,
    height: '350px',
    axisY: {
      onlyInteger: true,
      labelOffset: {
        y: 5
      }
    },
    plugins: [
      ChartistTooltip({
        anchorToPoint: true,
        tooltipOffset: { x: 0, y: -2 },
        transformTooltipTextFnc: (v) => null,
        tooltipText: (meta) => meta
      })
    ]
  }

  const listener = {
    draw (ctx) {
      if (ctx.type === 'bar') {
        ctx.element.attr({
          style: `
            stroke-width: ${ctx.meta ? '120px' : '0px'};
            stroke: ${ctx.series[ctx.index].color}
          `
        })
      }
    }
  }

  return (
    <div style={{ margin: '0 auto', width: '250px', position: 'relative' }}>
      <ChartistGraph
        type='Bar'
        data={data}
        options={options}
        listener={listener} />
    </div>
  )
}

DonationsGraph.propTypes = {
  donations: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired
  })).isRequired,
  target: PropTypes.number.isRequired
}

export default DonationsGraph
