import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import qs from 'querystring'
import Helmet from 'react-helmet'
import { setJwt, requestUser, requestCreateUser } from '../../../redux/actions/user'
import Loading from '../../components/loading.jsx'

const Auth0Callback = React.createClass({
  propTypes: {
    config: PropTypes.shape({ apiUrl: PropTypes.string.isRequired }).isRequired,
    setJwt: PropTypes.func.isRequired,
    requestUser: PropTypes.func.isRequired,
    requestCreateUser: PropTypes.func.isRequired
  },

  getInitialState() {
    return { errorMessage: '' }
  },

  componentDidMount() {
    const { id_token: jwt, state } = qs.parse(window.location.hash)

    if (!jwt) {
      console.error('Missing JWT in URL hash')
      return this.setState({ errorMessage: 'Missing ID token' })
    }

    this.props.setJwt(jwt)
    let stateObj
    let registration = (window.localStorage.getItem('registerMemo') !== null) ? true : false

    try {
      stateObj = JSON.parse(state).id
      if (!registration) throw new Error('No id in state object')

      let registerMemo

      try {
        registerMemo = JSON.parse(window.localStorage.getItem('registerMemo'))
      } catch (err) {
        console.error('Failed to parse register memo', err)
        return this.setState({ errorMessage: 'Missing or invalid registration details' })
      }

      const { id, token, data } = registerMemo

      window.localStorage.removeItem('registerMemo')

      if (stateObj !== id) {
        console.error(`Unexpected register ID ${state}, expected ${id}`)
        return this.setState({ errorMessage: 'Invalid registration ID' })
      }

      this.props.requestCreateUser(data, token)
        .then(() => browserHistory.replace('/profile'))
        .catch((err) => {
          console.error('Failed to create user', err)
          this.props.setJwt(null)
          this.setState({ errorMessage: 'Register failed' })
        })
    } catch (err) {
      console.error('Failed to parse stateId', err)

      return this.props.requestUser()
        .then(() => {
          browserHistory.replace('/profile')
        })
        .catch((err) => {
          console.error('Failed to request user', err)
          this.props.setJwt(null)
          this.setState({ errorMessage: 'Login failed' })
        })


    }
  },

  render() {
    const { errorMessage } = this.state
    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'auth0-callback-page' }} />
        <div className='col-lg-12 col-sm-12'>
          <section className='panel'>
            <section className='panel-body'>
              <div className='text-center'>
                {errorMessage ? (
                  <div>
                    <h1 className='text-danger'>Error</h1>
                    <p className='lead text-danger'>{errorMessage}</p>
                  </div>
                ) : (
                    <div>
                      <Loading />
                      <p className='lead'>{errorMessage || 'Please wait...'}</p>
                    </div>
                  )}
              </div>
            </section>
          </section>
        </div>
      </section>
    )
  }
})

const mapStateToProps = ({ user, config }) => ({ user, config })
const mapDispatchToProps = { setJwt, requestUser, requestCreateUser }

export default connect(mapStateToProps, mapDispatchToProps)(Auth0Callback)
