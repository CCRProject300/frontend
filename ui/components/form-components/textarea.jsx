import React from 'react'
import Joi from 'joi'

export const TextArea = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.string,
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    parentOnChange: React.PropTypes.func
  },

  formComponent: true,

  getDefaultProps () {
    return { name: 'input', placeholder: '' }
  },

  getInitialState () {
    return { error: '' }
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

  onFocus () {
    this.setState({ error: '' })
  },

  render () {
    return (
      <div className={`form-group ${this.state.error ? 'has-error' : ''}`}>
        {this.props.label ? <label htmlFor={this.props.name}>{this.props.label}</label> : null}
        <textarea name={this.props.name}
          className='form-control'
          placeholder={this.props.placeholder}
          value={this.props.value || ''}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <span className='help-block'>{this.state.error}</span>
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
