import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formatNumber from 'simple-format-number'
import { Link } from 'react-router'
import uccdn from '../../lib/uccdn'

class CharityBucket extends Component {
  static propTypes = {
    bucket: PropTypes.object.isRequired
  }

  render () {
    const { bucket } = this.props
    const formattedTotal = formatNumber(bucket.total, { fractionDigits: 0 })

    return (
      <Link to={`/charity/${bucket._id}`} className='bucket' title={bucket.name}>
        <div className='panel panel-default'>
          <div className='panel-body text-center'>
            <div
              className='m-b-2'
              style={{
                height: '150px',
                backgroundImage: bucket.logo ? `url(${uccdn(bucket.logo, '-/resize/x300/-/quality/lighter/')})` : 'none',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }} />
            <h4 className='truncate'>{bucket.name}</h4>
          </div>
          <div className='panel-footer text-center'>
            <span style={{ fontSize: '22px', verticalAlign: 'middle' }}>
              {formattedTotal}
            </span> <span className='coin'></span> raised
          </div>
        </div>
      </Link>
    )
  }
}

export default CharityBucket
