import React from 'react'
import { connect } from 'react-redux'
import { requestUpdateTeam } from '../../redux/actions/team'

const EditableTeamName = React.createClass({
  propTypes: {
    team: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      member: React.PropTypes.boolean
    }).isRequired,
    requestUpdateTeam: React.PropTypes.func
  },

  getInitialState () {
    return {
      editingName: false,
      name: this.props.team.name
    }
  },

  componentWillReceiveProps ({ team: { name } }) {
    this.setState({ name })
  },

  toggleEditing () {
    this.setState({ editingName: !this.state.editingName })
  },

  updateName (evt) {
    this.setState({ name: evt.target.value })
  },

  saveName () {
    this.toggleEditing()
    this.props.requestUpdateTeam(this.props.team._id, { name: this.state.name })
  },

  onKeyDown (evt) {
    if (evt.which === 13) this.saveName()
  },

  render () {
    const { updateName, toggleEditing, saveName, onKeyDown } = this
    const { member, name } = this.props.team
    if (!member) {
      return (
        <div>
          <h1>
            <i className='fa fa-trophy'></i>
            <span className='d-inline-block m-l-1'>{name}</span>
          </h1>
        </div>
      )
    }
    return (
      <div style={{ height: '5rem' }}>
        <h1>
          <i className='fa fa-trophy'></i>
          {this.state.editingName
            ? <input
              className='form-control input-lg m-l-1'
              style={{ width: 'auto', verticalAlign: 'middle', display: 'inline-block' }}
              value={this.state.name}
              onChange={updateName}
              onBlur={saveName}
              onKeyDown={onKeyDown}
              autoFocus />
            : <span className='m-l-1 pointer' onClick={toggleEditing}>
              {name} <i className='fa fa-pencil only-hover' style={{ fontSize: '0.6em', lineHeight: 0.6 }} />
            </span>
          }
        </h1>
      </div>
    )
  }
})

const mapDispatchToProps = { requestUpdateTeam }

export default connect(null, mapDispatchToProps)(EditableTeamName)
