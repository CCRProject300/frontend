import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formatNumber from 'simple-format-number'
import uccdn from '../../lib/uccdn'

class ShopItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onBuy: PropTypes.func.isRequired
  }

  onBuyButtonClick = (e) => {
    e.preventDefault()
    this.props.onBuy(this.props.item)
  }

  render () {
    const { item, user } = this.props
    const coins = (user && user.kudosCoins) || 0
    const formattedPrice = formatNumber(item.price, { fractionDigits: 0 })

    let disabled = false
    let buyButtonTitle = `Buy it now for ${formattedPrice} KudosCoins`

    if (!item.stockLevel) {
      disabled = true
      buyButtonTitle = 'Out of stock'
    } else if (coins < item.price) {
      disabled = true
      buyButtonTitle = 'You do not have enough KudosCoins to buy this'
    }

    return (
      <div className='panel panel-default'>
        {item.image ? (
          <img className='pull-left' style={{ width: '150px', height: '150px' }} src={uccdn(item.image, '-/scale_crop/300x300/center/-/quality/lighter/')} />
        ) : null}
        <div style={{ height: '150px', overflow: 'auto' }}>
          <div className='p-a-1'>
            <h4 className='media-heading'>{item.name}</h4>
            {item.description ? (
              <p>{item.description}</p>
            ) : null}
          </div>
        </div>
        <div className='panel-footer text-right'>
          <div className='pull-left'>
            <span style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: '5px' }}>{formattedPrice}</span>
            <span className='coin'></span>
          </div>
          <small className='m-r-1'><b>{item.stockLevel}</b> remaining</small>
          <button
            className='btn btn-primary'
            disabled={!!disabled}
            title={buyButtonTitle}
            onClick={this.onBuyButtonClick}>
            Buy now
          </button>
        </div>
      </div>
    )
  }
}

export default ShopItem
