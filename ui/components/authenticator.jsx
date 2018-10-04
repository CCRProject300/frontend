import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import JwtManager from './jwt-manager.jsx'
import { requestUser } from '../../redux/actions/user'
import { requestCompanies } from '../../redux/actions/companies'

const Authenticator = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    requestUser: React.PropTypes.func.isRequired,
    noAuth: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
    redirectOnLogin: React.PropTypes.string
  },

  componentDidMount () {
    this.props.requestUser()
    this.props.requestCompanies()
  },

  componentWillReceiveProps (nextProps) {
    // Redirect on login if required
    if (nextProps.user && !this.props.user && nextProps.redirectOnLogin) {
      browserHistory.push(nextProps.redirectOnLogin)
    }
  },

  render () {
    // If the user is logged in show the contents of the component
    if (this.props.user) {
      return this.props.children || null
    }

    // If alternative content provided, show it
    if (this.props.noAuth) {
      return React.createElement(this.props.noAuth, this.props)
    }

    return null
  }
})

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = { requestUser, requestCompanies }

let ConnectedAuthenticator = connect(mapStateToProps, mapDispatchToProps)(Authenticator)

export default (props) => (
  <JwtManager>
    <ConnectedAuthenticator {...props} />
  </JwtManager>
)
