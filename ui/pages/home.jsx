import React from 'react'
import { browserHistory } from 'react-router'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { requestValidateCompanyToken } from '../../redux/actions/company-tokens'
import LoginOrRegister from '../components/login-or-register.jsx'

const Home = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    route: React.PropTypes.object,
    requestValidateCompanyToken: React.PropTypes.func
  },

  getInitialState () {
    return {
      company: null,
      token: null
    }
  },

  componentDidMount () {
    if (this.props.user) {
      return browserHistory.replace('/profile')
    }
    const query = this.props.location.query
    if (query && query.token) {
      this.setState({ token: query.token })
      this.props.requestValidateCompanyToken(query.token)
        .then((res) => {
          this.setState({ company: res })
        })
    }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) {
      browserHistory.replace('/profile')
    }
  },

  render () {
    // Route could exist on props (if this is a router component) or on children
    // if this is being rendered by the authenticator.
    const routes = this.props.routes || (this.props.children && this.props.children.props.routes)
    const currentRoute = routes ? routes[routes.length - 1] : {}
    return (
      <div >
        <Helmet htmlAttributes={{class: 'home-page'}} />
        <div className='p-x-3'>
          <img src='/imgs/logo.png' alt='KudosHealth' className='img-responsive m-x-auto m-y-3' style={{maxWidth: '300px'}} />
          <div className='m-x-auto p-t-3' style={{maxWidth: '500px'}}>
            <p className='lead white'>Please log in or register</p>
            <LoginOrRegister initialTab={currentRoute.initialTab} token={this.state.token} company={this.state.company} />
          </div>
        </div>
      </div>
    )
  }
})

const mapStateToProps = ({ user, companies, routing }) => ({ user, companies, routing })
const mapDispatchToProps = { requestValidateCompanyToken }

export default connect(mapStateToProps, mapDispatchToProps)(Home)
