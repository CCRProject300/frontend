import React from 'react'
import Joi from 'joi'

export const MultiInput = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    type: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.arrayOf(React.PropTypes.string),
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    parentOnChange: React.PropTypes.func
  },

  formComponent: true,

  validating: false,

  getDefaultProps () {
    return {
      type: 'text'
    }
  },

  getInitialState () {
    return {
      error: '',
      value: ''
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
    this.setState({ value: evt.currentTarget.value })
  },

  onBlur: function () {
    if (!this.validating) setTimeout(() => this.validate(), 0)
  },

  onFocus (e) {
    this.setState({ error: '' })
  },

  checkEnter (evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault()
      this.addItem()
    }
  },

  addItem (field) {
    this.validating = true
    let items = Array.from(this.props.value || [])
    items.push(this.state.value)
    Joi.validate(items, this.props.schema[this.props.name], (err) => {
      if (err) return this.setState({ error: err.message })
      this.props.setParentState({ [this.props.name]: items }, () => {
        this.props.parentOnChange && this.props.parentOnChange(this.props.name, items)
      })
      this.setState({ value: '' }, () => {
        this.validating = false
        this.validate()
      })
    })
  },

  removeItem (item) {
    let items = Array.from(this.props.parentState[this.props.name] || [])
    items = items.filter((i) => i !== item)
    this.props.setParentState({ [this.props.name]: items })
  },

  render () {
    const values = this.props.parentState[this.props.name]
    return (
      <div className={`form-group ${this.state.error ? 'has-error' : ''}`}>
        {this.props.label ? <label htmlFor={this.props.name}>{this.props.label}</label> : null}
        <div className='input-group'>
          <input type={this.props.type}
            className='form-control'
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onKeyDown={this.checkEnter}
          />
          <span className='input-group-btn'>
            <button className='btn btn-default' type='button' onClick={this.addItem}><i className='fa fa-plus'></i></button>
          </span>
        </div>
        <span className='help-block'>{this.state.error}</span>
        <div className='h4' style={{ margin: '0 10px' }}>
          {values && values.map((val, ind) => {
            return (
              <div key={ind} className='label label-tag label-primary'>
                {val} <i className='fa fa-remove' onClick={this.removeItem.bind(this, val)}></i>
              </div>
            )
          })}
        </div>
        {values && values.length ? <hr /> : ''}
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
