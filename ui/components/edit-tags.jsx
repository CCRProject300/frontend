import React, { PropTypes } from 'react'

const EditTags = React.createClass({
  propTypes: {
    title: PropTypes.string,
    tags: PropTypes.array.isRequired,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  },
  getInitialState () {
    const initialState = {
      addValue: '',
      tagValues: Array.from(this.props.tags)
    }
    return initialState
  },
  componentWillReceiveProps (nextProps) {
    this.setState({ tagValues: Array.from(nextProps.tags) })
  },
  onChange (evt, i) {
    const tagValues = Array.from(this.state.tagValues)
    tagValues[i] = evt.target.value
    this.setState({ tagValues })
  },
  onDelete (evt, i) {
    this.props.onDelete(this.props.tags[i])
  },
  onUpdate (evt, i) {
    const oldValue = this.props.tags[i]
    const newValue = this.state.tagValues[i]
    if (!newValue) return
    this.props.onUpdate(oldValue, newValue)
  },
  onCreate (evt) {
    const newValue = this.state.addValue
    if (!newValue) return
    this.setState({ addValue: '', tagValues: this.state.tagValues.concat(newValue) })
    this.props.onCreate(newValue)
  },
  onKeyPress (evt, i) {
    if (evt.which === 13) {
      evt.preventDefault()
      this.onUpdate(evt, i)
    }
  },
  onAddChange (evt) {
    this.setState({ addValue: evt.target.value })
  },
  onAddKeyPress (evt) {
    if (evt.which === 13) {
      evt.preventDefault()
      this.onCreate(evt)
    }
  },
  render () {
    const { onDelete, onUpdate, onChange, onCreate, onKeyPress, onAddChange, onAddKeyPress } = this
    const { addValue, tagValues } = this.state
    const { title, tags } = this.props
    return (
      <div>
        {title && <label>{title}</label>}
        {tags.map((tag, i) => (
          <div className='d-block m-b-1' key={tag}>
            <input
              className='d-inline-block p-x-1 m-r-1'
              value={tagValues[i]}
              onChange={(evt) => onChange(evt, i)}
              onKeyPress={(evt) => onKeyPress(evt, i)}
            />
            <span>
              <button
                title={`Save changes to ${tag}`}
                type='button'
                className='d-inline btn btn-xs btn-warning m-r-1'
                onClick={(evt) => onUpdate(evt, i)}
                disabled={tag === tagValues[i]}>
                Save
              </button>
              <button
                title={`Delete ${tag}`}
                type='button'
                className='d-inline btn btn-xs btn-danger'
                onClick={(evt) => onDelete(evt, i)}>
                <i className='fa fa-trash-o'></i>
              </button>
            </span>
          </div>
        ))}
        <div className='d-block m-b-1'>
          <input
            data-tag='addValue'
            value={addValue}
            onChange={onAddChange}
            onKeyPress={(evt) => onAddKeyPress(evt)}
            className='d-inline-block p-x-1 m-r-1'
          />
          <button
            title={`Create new ${title ? title.toLowerCase() : 'item'}`}
            type='button'
            className='d-inline btn btn-xs btn-warning'
            onClick={onCreate}>
            <i className='fa fa-plus'></i>
          </button>
        </div>
      </div>
    )
  }
})

export default EditTags
