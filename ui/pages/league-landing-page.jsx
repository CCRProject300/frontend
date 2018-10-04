import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Modal } from 'react-bootstrap'
import JwtManager from '../components/jwt-manager.jsx'
import LoginOrMessage from '../components/login-or-message.jsx'
import { requestPublicLeague, requestJoinLeague } from '../../redux/actions/league.js'
import { requestUser } from '../../redux/actions/user'
import { addPopTartMsg } from '../../redux/actions/popmsgs.js'

const message = 'In order to join a public league, you\'ll need to sign up to KudosHealth as part of a company.  Speak to your corporate moderator to request an invitation.'

class LeagueLandingPage extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    logo: React.PropTypes.string.isRequired,
    heroImage: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    body: React.PropTypes.string.isRequired,
    requestJoinLeague: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    user: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = { modalShown: false, joinLeague: false }
  }

  componentWillReceiveProps ({ user, id }) {
    const { addPopTartMsg, requestJoinLeague } = this.props

    if (this.state.joinLeague && !this.props.user && user) {
      requestJoinLeague({ leagueId: id })
        .then(() => {
          browserHistory.push(`/league/${id}/leaderboard`)
        })
        .catch((err) => {
          // User is already a league member
          if (err.message === 'User has already been activated in league') return browserHistory.push(`/league/${id}/leaderboard`)
          addPopTartMsg({ message: err.message, level: 'error' })
        })
    }
  }

  joinLeague = () => {
    const { id, addPopTartMsg, requestJoinLeague } = this.props

    if (!this.props.user) {
      return this.setState({ modalShown: true, joinLeague: true })
    }

    requestJoinLeague({ leagueId: id })
      .then(() => {
        browserHistory.push(`/league/${id}/leaderboard`)
      })
      .catch((err) => {
        // User is already a league member
        if (err.message === 'User has already been activated in league') return browserHistory.push(`/league/${id}/leaderboard`)
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  }

  hideModal = () => {
    this.setState({ modalShown: false })
  }

  renderModal = () => {
    const { modalShown } = this.state

    return (
      <Modal show={modalShown} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please login to join the league</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='join-league-modal-background'>
            <LoginOrMessage initialTab='login' message={message} />
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  render () {
    const { renderModal, joinLeague } = this
    const { logo, heroImage, title, body } = this.props

    return (
      <div className='league-landing-page'>
        <div className='hero-image' style={{ backgroundImage: `url('${heroImage}')` }}>
          <div className='logo-bar'>
            <Link className='logo' to='/'><img src='/imgs/logo.png' /></Link>
            <div className='logo'><img src={logo} /></div>
          </div>
          <div className='main-flex'>
            <div className='text-content'>
              <h1 className='title'>{title}</h1>
              <p>{body}</p>
            </div>
            <div onClick={joinLeague} className='join-button'>
              <button className='btn btn-primary btn-large'>Join League</button>
            </div>
            <div className='overlay hidden-xs hidden-sm' />
          </div>
        </div>
        <div className='bottom-bar'>
          <span className='hidden-xs hidden-sm'>
            <img className='app-logo' src='/imgs/apps/strava-logo.png' />
            <img className='app-logo' src='/imgs/apps/fitbit-logo.png' />
            <img className='app-logo' src='/imgs/apps/runkeeper-logo.png' />
            <img className='app-logo' src='/imgs/apps/google-fit-logo.png' />
          </span>
          <span className='visible-xs visible-sm'>
            <img className='app-logo' src='/imgs/apps/strava.png' />
            <img className='app-logo' src='/imgs/apps/fitbit.png' />
            <img className='app-logo' src='/imgs/apps/runkeeper.png' />
            <img className='app-logo' src='/imgs/apps/google-fit.png' />
          </span>
        </div>
        {renderModal()}
      </div>
    )
  }
}

class LeagueLandingPageContainer extends Component {
  componentDidMount () {
    if (!this.props.league) this.props.requestPublicLeague(this.props.params.leagueId)
    this.props.requestUser()
  }

  render () {
    if (!this.props.league) return null
    const { user, requestJoinLeague, addPopTartMsg } = this.props
    const { logo, heroImage, title, body } = this.props.league.branding
    return (
      <LeagueLandingPage
        id={this.props.league._id}
        logo={logo}
        heroImage={heroImage}
        title={title}
        body={body}
        user={user}
        requestJoinLeague={requestJoinLeague}
        addPopTartMsg={addPopTartMsg}
      />
    )
  }
}

LeagueLandingPageContainer.fetchData = ({store, params, state}) => {
  return store.dispatch(requestPublicLeague(params.leagueId))
}

const mapStateToProps = ({ league, user }) => ({ league, user })
const mapDispatchToProps = { requestUser, requestPublicLeague, requestJoinLeague, addPopTartMsg }
const ConnectedLeagueLandingPage = connect(mapStateToProps, mapDispatchToProps)(LeagueLandingPageContainer)

export default (props) => (
  <JwtManager>
    <ConnectedLeagueLandingPage {...props} />
  </JwtManager>
)
