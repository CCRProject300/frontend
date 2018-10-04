import React from 'react'
import Joi from 'joi'
import DatePickerComponent from 'react-bootstrap-date-picker'

export const DatePicker = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    schema: React.PropTypes.object,
    value: React.PropTypes.string,
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
    dateFormat: React.PropTypes.string,
    parentOnChange: React.PropTypes.func
  },

  formComponent: true,

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

  onChange (date) {
    this.props.setParentState({ [this.props.name]: date }, () => {
      this.props.parentOnChange && this.props.parentOnChange(this.props.name, date)
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
        <label>{this.props.label}</label>
        <DatePickerComponent
          value={this.props.value || ''}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          dateFormat={this.props.dateFormat}
        />
        <span className='help-block'>{this.state.error}</span>
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
