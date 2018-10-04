import React from 'react'
import Joi from 'joi'
import omit from 'lodash.omit'

export const Input = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    type: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    parentOnChange: React.PropTypes.func,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  },

  formComponent: true,

  getDefaultProps () {
    return {
      name: 'input',
      type: 'text',
      placeholder: ''
    }
  },

  getInitialState () {
    return {
      error: ''
    }
  },

  validate () {
    const field = this.props.name
    Joi.validate(this.props.parentState, this.props.schema, { abortEarly: false }, (err) => {
      if (!err) return
      const thisError = err.details.find((e) => e.path === field)
      if (!thisError) return
      this.setState({ error: thisError.message })
    })
  },

  onChange (evt) {
    const val = evt.currentTarget.value
    this.props.setParentState({ [this.props.name]: val }, () => {
      this.props.parentOnChange && this.props.parentOnChange(this.props.name, val)
    })
  },

  onBlur: function () {
    setTimeout(() => this.validate(), 0)
  },

  onFocus (e) {
    this.setState({ error: '' })
  },

  render () {
    const extraProps = omit(this.props, ['label', 'schema', 'parentState', 'setParentState', 'parentOnChange'])
    let className = 'form-group ' + (this.state.error ? 'has-error' : '')

    return (
      <div className={className}>
        {this.props.label ? <label htmlFor={this.props.name}>{this.props.label}</label> : null}
        <input {...extraProps}
          className={this.props.className ? this.props.className : 'form-control'}
          style={this.props.style}
          value={this.props.value || ''}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        {this.state.error ? <span className='help-block'>{this.state.error}</span> : null}
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
