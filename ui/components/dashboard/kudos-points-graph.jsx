import React, { PropTypes } from 'react'
import chroma from 'chroma-js'
import moment from 'moment'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from '../../lib/chartist-tooltip.js'
import Loading from '../loading.jsx'

const chromaScale = chroma.scale(['#009ee0', '#003247'])

const TimeLabel = ({startDate, timespan, ...props}) => {
  const start = moment(startDate).utc()
  const label = (() => {
    if (timespan === 'daily') return start.format('dddd, Do MMM')
    if (timespan === 'weekly') return `${start.startOf('week').format('Do MMM')} - ${start.add(6, 'days').format('Do MMM')}`
    if (timespan === 'monthly') return start.format('MMMM YYYY')
  })()
  return <time dateTime={startDate} {...props}>{label}</time>
}

const KudosPointsGraph = ({graph, timespan, startDate, onChangeTimespan, onChangeStartDate, loading}) => {
  const hasData = graph && graph.series && graph.series[0]
  const canGoForward = moment(startDate).utc().isBefore(moment().utc().startOf('day'))
  const seriesColors = graph && graph.series ? chromaScale.colors(graph.series.length) : chromaScale.colors(2)
  const responsiveOptions = [
    ['screen and (max-width: 640px)', {
      seriesBarDistance: 0,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          if (timespan === 'daily') return index % 8 === 0 ? value : null
          if (timespan === 'monthly') return (index + 1) % 5 === 0 ? value : null
          return index % 2 === 0 ? value : null
        }
      }
    }]
  ]
  const options = {
    fullWidth: true,
    stackBars: true,
    seriesBarDistance: 5,
    axisX: {
      showGrid: false,
      labelInterpolationFnc: function (value, index) {
        if (timespan === 'daily') return index % 8 === 0 ? value : null
        if (timespan === 'monthly') return (index + 1) % 5 === 0 ? value : null
        return value
      }
    },
    axisY: {
      onlyInteger: true,
      showLabel: true
    },
    plugins: [ChartistTooltip({
      anchorToPoint: true,
      transformTooltipTextFnc: (v) => Number(v).toFixed(1).replace('.0', '')
    })]
  }
  const listener = {
    'draw': (ctx) => {
      if (ctx.type === 'bar') {
        const {stepLength} = ctx.axisX
        const padding = stepLength / 10
        const width = Math.floor(stepLength - padding)
        const color = seriesColors[ctx.seriesIndex || 0]
        ctx.element.attr({
          style: `stroke-width: ${width}px; stroke: ${color}`
        })
      }
    }
  }
  return (
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <TimeLabel className='pull-xs-right' startDate={startDate} timespan={timespan} />
        <h3 className='panel-title'>
          KudosPoints
        </h3>
      </div>
      <div className='panel-body'>
        <div className='chart'>
          <div id='main-chart' className='daily ct-chart ct-major-twelfth'>
            <div>
              {!hasData &&
                <div id='no-data'>
                  {loading ? <Loading /> : (
                    <div>
                      <p>No Data For Selected Period</p>
                    </div>
                  )}
                </div>
              }
              <ChartistGraph
                type='Bar'
                data={graph || {series: []}}
                options={options}
                responsiveOptions={responsiveOptions}
                listener={listener}
              />
            </div>
          </div>
        </div>
        <div className='m-b-1 w100 p-x-3 text-xs-center'>
          <button title='Back' className='btn btn-default pull-xs-left' onClick={() => onChangeStartDate('subtract')}>
            &larr;
          </button>
          <button title='Forward' className='btn btn-default pull-xs-right' onClick={() => onChangeStartDate('add')} style={{opacity: canGoForward ? 1 : 0}} disabled={!canGoForward}>
            &rarr;
          </button>
          <ul className='nav nav-pills display-ib'>
            <li role='presentation' className={timespan === 'daily' ? 'active' : ''}>
              <a href='#' onClick={() => onChangeTimespan('daily')}>Day</a>
            </li>
            <li role='presentation' className={timespan === 'weekly' ? 'active' : ''}>
              <a href='#' onClick={() => onChangeTimespan('weekly')}>Week</a>
            </li>
            <li role='presentation' className={timespan === 'monthly' ? 'active' : ''}>
              <a href='#' onClick={() => onChangeTimespan('monthly')}>Month</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

KudosPointsGraph.propTypes = {
  graph: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    series: PropTypes.arrayOf(PropTypes.array).isRequired
  }),
  timespan: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  onChangeTimespan: PropTypes.func.isRequired,
  onChangeStartDate: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default KudosPointsGraph
