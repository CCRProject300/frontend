import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CharityBucket extends Component {
  static propTypes = {
    bucket: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  }

  onEditButtonClick = (e) => {
    e.preventDefault()
    this.props.onEdit(this.props.bucket)
  }

  onDeleteButtonClick = (e) => {
    e.preventDefault()
    this.props.onDelete(this.props.bucket)
  }

  render () {
    const { bucket } = this.props
    const { onEditButtonClick, onDeleteButtonClick } = this

    return (
      <tr>
        <td>{bucket.name}</td>
        <td>{bucket.target}</td>
        <td className={bucket.total > bucket.target ? 'text-danger' : ''}>{bucket.total}</td>
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

export default CharityBucket
