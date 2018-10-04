import React from 'react'
import { connect } from 'react-redux'
import { IndexLink, browserHistory } from 'react-router'
import { OverlayTrigger, Button, Popover, Dropdown } from 'react-bootstrap'
import { setView } from '../../redux/actions/view'
import { requestStarted, requestLogout } from '../../redux/actions/user'
import { requestReplyToInvitation } from '../../redux/actions/invitations'
import NotificationButton from './notification-button.jsx'
import Avatar from '../components/avatar.jsx'
import { hasRole, getRoleName } from '../../lib/roles'

const Header = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    companies: React.PropTypes.array,
    view: React.PropTypes.string,
    setView: React.PropTypes.func,
    requestLogout: React.PropTypes.func
  },
  toggleSidebar () {
    const body = document.body
    if (new RegExp('show-sidebar').test(body.className)) {
      body.className = body.className.replace('show-sidebar', 'hide-sidebar')
    } else {
      body.className = body.className.replace('hide-sidebar', 'show-sidebar')
    }
  },
  componentDidMount () {
    document.body.className = window.innerWidth >= 480 ? 'show-sidebar' : 'hide-sidebar'
  },
  switchToView (view) {
    this.props.setView(view)
    browserHistory.push('/profile')
  },
  markStarted (url) {
    if (url === '/getting-started') this.props.requestStarted()
    if (url) browserHistory.push(url)
  },
  acceptInvitation (details) {
    this.props.requestReplyToInvitation(Object.assign({}, details, { accepted: true }))
  },
  rejectInvitation (details) {
    this.props.requestReplyToInvitation(Object.assign({}, details, { accepted: false }))
  },
  logout () {
    this.props.requestLogout()
  },
  render () {
    const company = this.props.companies && this.props.companies[0]
    const showLogo = company && company.logo && (this.props.view !== 'admin')

    return (
      <div className='navbar navbar-default navbar-fixed-top bg-primary white'>
        <div className='pull-left'>
          <div className='navbar-brand m-a-0 p-a-0'>
            <a onClick={this.toggleSidebar} className='btn btn-lg btn-text white m-r-1' title='Toggle sidebar'>
              <span className='fa fa-bars'></span>
            </a>
            <IndexLink to='/' title='Go to Dashboard' className='hidden-xs'>
              <img src='/imgs/logo.png' alt='KudosHealth' style={{width: '142px'}} />
            </IndexLink>
            {
              showLogo
              ? (
                <a href='#' className='company-logo hidden-xs hidden-sm' style={{marginTop: '10px', marginLeft: '15px', float: 'left'}}>
                  <img src={company.logo} alt={company.name} style={{height: '22px'}} />
                </a>
              )
              : ''
            }
          </div>
          <div className='display-ib' style={{marginLeft: 16}}>
            {this.renderTasksButton()}
            {this.renderInboxButton()}
            <NotificationButton notifications={this.props.notifications} />
          </div>
        </div>
        <div className='pull-right display-ib'>
          {this.renderSwitch()}
          <Dropdown id='header_user_settings' pullRight>
            <Dropdown.Toggle useAnchor className='btn btn-sm navbar-btn m-l-3 m-r-2 m-y-1'>
              <Avatar user={this.props.user} />
              <span className='username'>{this.props.user.firstName} {this.props.user.lastName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className='extended logout'>
              <li>
                <IndexLink activeClassName='active' to='/settings'>
                  <i className='fa fa-cog m-r-1'></i>
                  Settings
                </IndexLink>
              </li>
              <li>
                <a href='#' onClick={this.logout}>
                  <i className='fa fa-key m-r-1'></i>
                  Log Out
                </a>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    )
  },
  renderTasksButton () {
    const content = (<p>You have no pending tasks</p>)
    return (
      <span className='m-x-1 hidden-xs'>
        <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={<Popover id='header-tasks-popover' className='gray-dark popover-title-bg-green' title='Tasks'>{content}</Popover>}>
          <Button className='btn btn-sm navbar-btn' style={{position: 'relative'}}>
            <i className='fa fa-tasks'></i>
          </Button>
        </OverlayTrigger>
      </span>
    )
  },
  renderInboxButton () {
    const content = (<p>You have no messages</p>)
    return (
      <span className='m-x-1 hidden-xs'>
        <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={<Popover id='header-messages-popover' className='gray-dark popover-title-bg-red' title='Inbox'>{content}</Popover>}>
          <Button className='btn btn-sm navbar-btn' style={{position: 'relative'}}>
            <i className='fa fa-envelope-o'></i>
          </Button>
        </OverlayTrigger>
      </span>
    )
  },
  renderSwitch () {
    const { view, user } = this.props

    // If not admin or corporate moderator then no switch
    if (!hasRole(user, ['admin', 'corporate_mod'])) return null

    const elevatedRole = hasRole(user, 'admin') ? 'admin' : 'corporate_mod'
    const userBtnClass = view === 'user' ? 'btn btn-primary active' : 'btn btn-primary'
    const modBtnClass = view !== 'user' ? 'btn btn-primary active' : 'btn btn-primary'

    return (
      <div className='btn-group hidden-xs' data-toggle='buttons'>
        <label className={modBtnClass}>
          <input name='role-switch' type='radio' onChange={() => this.switchToView(elevatedRole)} checked={view === elevatedRole} /> {getRoleName(elevatedRole)}
        </label>
        <label className={userBtnClass}>
          <input name='role-switch' type='radio' onChange={() => this.switchToView('user')} checked={view === 'user'} /> Private
        </label>
      </div>
    )
  }
})

const mapStateToProps = ({ user, view, notifications, companies }) => ({ user, view, notifications, companies })
const mapDispatchToProps = { setView, requestStarted, requestReplyToInvitation, requestLogout }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
