import React from 'react'
import Joi from 'joi'

export const Select = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    options: React.PropTypes.oneOfType([ React.PropTypes.array, React.PropTypes.object ]),
    schema: React.PropTypes.object,
    value: React.PropTypes.string,
    parentState: React.PropTypes.object,
    setParentState: React.PropTypes.func,
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
    const optionsProp = this.props.options || []
    const optionVals = optionsProp instanceof Array ? optionsProp : Object.keys(optionsProp)
    const options = optionVals.map((val) => ({ val, label: this.props.options[val] || val }))
    return (
      <div className={`form-group ${this.state.error ? 'has-error' : ''}`}>
        <label>{this.props.label}</label>
        <select className='form-control' onChange={this.onChange} value={this.props.value || ''}>
          <option></option>
          {options.map((opt, ind) => {
            return <option key={ind} value={opt.val}>{opt.label}</option>
          })}
        </select>
        <span className='help-block'>{this.state.error}</span>
      </div>
    )
  },

  componentWillUnmount () {
    this.props.setParentState({ [this.props.name]: undefined })
  }
})
