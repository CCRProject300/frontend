import React from 'react'
import Joi from 'joi'
import objectPath from 'object-path'

// SUPER minimal function to infer a default object from a Joi schema
function makeDefault (schema) {
  return Object.keys(schema).reduce((def, key) => {
    const val = schema[key]
    if (val._flags.default) {
      def[key] = val._flags.default
      return def
    }
    if (val._flags.presence !== 'required') return def
    def[key] = {
      string: '',
      number: null,
      array: [],
      object: {}
    }[val._type]
    return def
  }, {})
}

export const Form = React.createClass({
  propTypes: {
    schema: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onValidate: React.PropTypes.func,
    defaults: React.PropTypes.object,
    children: React.PropTypes.array,
    className: React.PropTypes.string
  },
  getInitialState () {
    return this.props.defaults || makeDefault(this.props.schema)
  },
  // Updates will come in the form { 'path.to.key': 'foobar' } and need to be merged into the existing state
  updateState (updateObj, cb) {
    this.setState((state) => {
      return Object.keys(updateObj).reduce((expandedObj, dotKey) => {
        objectPath.set(expandedObj, dotKey, updateObj[dotKey])
        return expandedObj
      }, state)
    }, cb)
  },
  getValue (name) {
    return objectPath.get(this.state, name)
  },
  onSubmit (evt) {
    evt.preventDefault()
    Joi.validate(this.state, this.props.schema, (err, values) => this.props.onSubmit(err, values, this.reset))
  },
  onChange (...params) {
    this.props.onChange && this.props.onChange(...params)
    this.onValidate()
  },
  onValidate () {
    this.props.onValidate && Joi.validate(this.state, this.props.schema, this.props.onValidate)
  },
  reset (formData) {
    this.setState(Object.assign({}, this.props.defaults || makeDefault(this.props.schema), formData))
  },
  componentDidMount () {
    this.onValidate()
  },
  componentWillReceiveProps ({ schema }) {
    Joi.validate(this.state, schema, this.onValidate)
  },
  render () {
    const children = React.Children.map(this.props.children, (child) => {
      if (!child) return null
      if (child.type && child.type.prototype && child.type.prototype.formComponent) {
        return React.cloneElement(child, {
          value: this.getValue(child.props.name),
          parentState: this.state,
          setParentState: this.updateState,
          parentOnChange: this.onChange,
          schema: this.props.schema })
      }
      return child
    })
    return (
      <form onSubmit={this.onSubmit} className={this.props.className}>
        {children}
      </form>
    )
  }
})
