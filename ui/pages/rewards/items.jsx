import React from 'react'
import PropTypes from 'prop-types'
import ShopItem from './item.jsx'

function ShopItems ({ user, items, onItemBuy }) {
  return (
    <div className='row'>
      {items.map((item) => (
        <div className='col-sm-6' key={item._id}>
          <ShopItem user={user} item={item} onBuy={onItemBuy} />
        </div>
      ))}
    </div>
  )
}

ShopItems.propTypes = {
  user: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onItemBuy: PropTypes.func.isRequired
}

export default ShopItems
