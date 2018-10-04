import React from 'react'
import PropTypes from 'prop-types'
import ShopItem from './item.jsx'

function ShopItems ({ items, onEditItem, onDeleteItem }) {
  return (
    <div className='table-responsive'>
      <table className='table table-fixed'>
        <thead>
          <tr>
            <th>Item</th>
            <th style={{width: 100}}>Price</th>
            <th style={{width: 100}}>Stock</th>
            <th style={{width: 125}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ShopItem item={item} onEdit={onEditItem} onDelete={onDeleteItem} key={item._id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

ShopItems.propTypes = {
  items: PropTypes.array.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
}

export default ShopItems
