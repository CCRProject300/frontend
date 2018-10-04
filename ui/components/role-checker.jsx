import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { hasRole } from '../../lib/roles'

const RoleChecker = React.createClass({
  propTypes: {
    role: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    user: PropTypes.object,
    wrongRoleComponent: PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func])
  },

  render () {
    // If the user's role is correct, show the contents of the component
    if (hasRole(this.props.user, this.props.role)) {
      return this.props.children || null
    }

    // If alternative content provided, show it
    if (this.props.wrongRoleComponent) {
      return React.createElement(this.props.wrongRoleComponent, this.props)
    }

    return null
  }
})

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(RoleChecker)
