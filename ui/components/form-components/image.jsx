import React from 'react'
import Uploadcare from '../uploadcare.jsx'

export const Image = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.string,
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    parentOnChange: React.PropTypes.func,
    noImageComponent: React.PropTypes.element,
    opts: React.PropTypes.object
  },

  formComponent: true,

  getDefaultProps () {
    return { name: 'image' }
  },

  getInitialState () {
    return { error: '' }
  },

  onChange (info) {
    this.props.setParentState({ [this.props.name]: info.cdnUrl }, () => {
      this.props.parentOnChange && this.props.parentOnChange(this.props.name, info.cdnUrl)
    })
  },

  render () {
    const { opts, label, noImageComponent } = this.props
    return (
      <Uploadcare
        opts={opts}
        label={label}
        noImageComponent={noImageComponent}
        onChange={this.onChange}
        image={this.props.value}
        error={this.state.error}
      />
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
