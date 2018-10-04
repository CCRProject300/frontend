import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { setJwt, setUser } from '../../redux/actions/user'

class JwtManager extends Component {
  static propTypes = {
    jwt: PropTypes.string,
    setUser: PropTypes.func.isRequired,
    setJwt: PropTypes.func.isRequired
  }

  componentDidMount () {
    const jwt = this.props.jwt

    if (!jwt) {
      return this.removeCredentials()
    }

    if (jwtDecode(jwt).exp < Date.now() / 1000) {
      return this.removeCredentials()
    }

    this.removeCredentialsOnJwtExpire(jwt)
  }

  componentWillReceiveProps ({ jwt }) {
    this.removeCredentialsOnJwtExpire(jwt)
  }

  componentWillUnmount () {
    clearTimeout(this.jwtTimeout)
  }

  removeCredentials () {
    this.props.setJwt(null)
    this.props.setUser(null)
  }

  // TODO: if we have a refresh token, use it to renew the JWT
  removeCredentialsOnJwtExpire (jwt) {
    clearTimeout(this.jwtTimeout)
    if (!jwt) return
    const period = Math.floor(jwtDecode(jwt).exp - (Date.now() / 1000))
    this.jwtTimeout = setTimeout(() => this.removeCredentials(), period * 1000)
  }

  render () {
    return <div>{this.props.children}</div>
  }
}

const mapStateToProps = ({ jwt }) => ({ jwt })
const mapDispatchToProps = { setJwt, setUser }
export default connect(mapStateToProps, mapDispatchToProps)(JwtManager)
