import React from 'react'
import ReactToggle from 'react-toggle'

export const Toggle = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    type: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.bool,
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    parentOnChange: React.PropTypes.func
  },

  formComponent: true,

  validating: false,

  getDefaultProps () {
    return {
      type: 'checkbox'
    }
  },
  getInitialState () {
    return {
      error: '',
      value: true
    }
  },
  onChange (evt) {
    const val = evt.currentTarget.checked
    this.props.setParentState({ [this.props.name]: val }, () => {
      this.props.parentOnChange && this.props.parentOnChange(this.props.name, val)
    })
  },
  render () {
    let className = 'form-group ' + (this.state.error ? 'has-error' : '')
    return (
      <div className={className}>
        <ReactToggle
          defaultChecked={this.props.value}
          name={this.props.name}
          value={this.props.name}
          onChange={this.onChange} />
        {this.props.label ? <span className='p-l-1 display-ib v-mid'>{this.props.label}</span> : null}
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
