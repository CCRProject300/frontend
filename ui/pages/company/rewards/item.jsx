import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ShopItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  }

  onEditButtonClick = (e) => {
    e.preventDefault()
    this.props.onEdit(this.props.item)
  }

  onDeleteButtonClick = (e) => {
    e.preventDefault()
    this.props.onDelete(this.props.item)
  }

  render () {
    const { item } = this.props
    const { onEditButtonClick, onDeleteButtonClick } = this

    return (
      <tr>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td className={item.stockLevel ? '' : 'text-danger'}>{item.stockLevel}</td>
        <td style={{ whiteSpace: 'nowrap' }}>
          <button className='btn btn-warning btn-xs m-r-1' onClick={onEditButtonClick}>
            Edit
          </button>
          <button className='btn btn-danger btn-xs' onClick={onDeleteButtonClick}>
            Delete
          </button>
        </td>
      </tr>
    )
  }
}

export default ShopItem
