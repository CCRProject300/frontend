import React from 'react'
import PopTart from '../components/popTart.jsx'

export default React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  render () {
    return (
      <div>
        {this.props.children}
        <PopTart />
      </div>
    )
  }
})
