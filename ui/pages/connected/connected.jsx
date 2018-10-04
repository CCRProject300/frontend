import React from 'react'
import ChartistGraph from 'react-chartist'
import { connect } from 'react-redux'
import { requestGraph } from '../../../redux/actions/graph'
import Loading from '../../components/loading.jsx'

const responsiveOptions = [
  ['screen and (max-width: 640px)', {
    seriesBarDistance: 0,
    axisX: {
      labelInterpolationFnc: function (value, index) {
        return index % 8 === 0 ? value : null
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
    labelOffset: {
      x: -3
    },
    labelInterpolationFnc: function (value, index) {
      return index % 4 === 0 ? value : null
    }
  },
  axisY: {
    onlyInteger: true
  }
}

const Connected = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool,
    strategy: React.PropTypes.string.isRequired,
    graph: React.PropTypes.shape({
      labels: React.PropTypes.array.isRequired,
      legend: React.PropTypes.array.isRequired,
      series: React.PropTypes.arrayOf(React.PropTypes.array).isRequired
    })
  },

  getInitialState () {
    return { timespan: 'weekly' }
  },

  componentWillMount () {
    this.props.requestGraph({ timespan: this.state.timespan, strategy: this.props.strategy })
  },

  render () {
    const updateTimespan = (timespan) => {
      return (e) => {
        e.preventDefault()
        this.props.requestGraph({ timespan, strategy: this.props.strategy })
          .then(() => this.setState({ timespan }))
      }
    }

    return (
      <div className='row'>
        <div className='col-lg-12'>
          <div className='panel terques-chart'>
            <div className='panel-body chart-texture'>
              <div className='chart'>
                <div id='main-chart' className='daily ct-chart ct-major-twelfth'>
                  {this.props.loading ? <Loading /> : (
                    <div>
                      {!this.props.graph || !this.props.graph.series || !this.props.graph.series[0] || !this.props.graph.series[0].length
                      ? <div id='no-data'>No Data</div>
                      : ''}
                      <ChartistGraph data={this.props.graph || {}} type='Bar' options={options} responsiveOptions={responsiveOptions} />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <ul className='ct-legend'></ul>
              </div>
              <div className='chart-title'>
                <span className='title'>Kudos Points</span>
                <ul className='nav nav-pills pull-right'>
                  <li role='presentation' className={this.state.timespan === 'daily' ? 'active' : ''} onClick={updateTimespan('daily')}>
                    <a href='#'>Day</a>
                  </li>
                  <li role='presentation' className={this.state.timespan === 'weekly' ? 'active' : ''} onClick={updateTimespan('weekly')}>
                    <a href='#'>Week</a>
                  </li>
                  <li role='presentation' className={this.state.timespan === 'monthly' ? 'active' : ''} onClick={updateTimespan('monthly')}>
                    <a href='#'>Month</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

const mapStateToProps = ({ graph }) => ({ graph })
const mapDispatchToProps = { requestGraph }

export default connect(mapStateToProps, mapDispatchToProps)(Connected)
