import React from 'react'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { Collapse } from 'react-bootstrap'
import { hasRole } from '../../lib/roles'

const AdminSidebar = () => {
  return (
    <aside id='sidebar'>
      <ul className='nav nav-dark nav-pills nav-stacked p-x-1'>
        <li role='presentation'>
          <IndexLink onlyActiveOnIndex activeClassName='active' to='/profile'>
            <i className='fa fa-dashboard p-r-1'></i>
            <span>Dashboard</span>
          </IndexLink>
        </li>
        <li role='presentation'>
          <Link activeClassName='active' to='/admin/users'>
            <i className='fa fa-users p-r-1'></i>
            <span>Users</span>
          </Link>
        </li>
        <li role='presentation'>
          <Link to='/admin/companies'>
            <i className='fa fa-globe p-r-1'></i>
            <span>Companies</span>
          </Link>
        </li>
        <li role='presentation'>
          <Link to='/admin/leagues'>
            <i className='fa fa-trophy p-r-1'></i>
            <span>Public Leagues</span>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

const CorporateSidebar = ({ companies, user }) => {
  const company = companies && companies[0]
  const hasRewardsRole = hasRole(user, 'rewards')

  return (
    <aside id='sidebar'>
      <ul className='nav nav-dark nav-pills nav-stacked p-x-1'>
        <li>
          <Link activeClassName='active' to='/profile'>
            <i className='fa fa-dashboard p-r-1'></i>
            <span>Dashboard</span>
          </Link>
        </li>
        {company ? (
          <li>
            <Link activeClassName='active' to={`/company/${encodeURIComponent(company._id)}/leagues`}>
              <i className='fa fa-sitemap p-r-1'></i>
              <span>Company Leagues</span>
            </Link>
          </li>
        ) : null}
        {company ? (
          <li>
            <Link activeClassName='active' to={`/company/${encodeURIComponent(company._id)}/members`}>
              <i className='fa fa-users p-r-1'></i>
              <span>Company Employees</span>
            </Link>
          </li>
        ) : null}
        {company && hasRewardsRole ? (
          <li>
            <Link activeClassName='active' to={`/company/${encodeURIComponent(company._id)}/rewards`}>
              <i className='fa fa-gift p-r-1'></i>
              <span>Rewards</span>
            </Link>
          </li>
        ) : null}
        {company && hasRewardsRole ? (
          <li>
            <Link activeClassName='active' to={`/company/${encodeURIComponent(company._id)}/transaction-logs`}>
              <i className='fa fa-history p-r-1'></i>
              <span>Transaction Logs</span>
            </Link>
          </li>
        ) : null}
        <li>
          <Link activeClassName='active' to='/faq'>
            <i className='fa fa-question p-r-1'></i>
            <span>FAQ</span>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

const Sidebar = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    companies: React.PropTypes.array
  },
  getInitialState () {
    return {
      appsDevices: false
    }
  },
  toggleCollapse (evt) {
    const name = evt.currentTarget.name
    this.setState({ [name]: !this.state[name] })
  },
  render () {
    const { companies, user } = this.props

    return (
      <aside id='sidebar'>
        <ul className='nav nav-dark nav-pills nav-stacked p-x-1'>
          <li>
            <Link activeClassName='active' to='/profile'>
              <i className='fa fa-dashboard p-r-1'></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link activeClassName='active' to='/leagues'>
              <i className='fa fa-trophy p-r-1'></i>
              <span>Leagues</span>
            </Link>
          </li>
          {companies.length && hasRole(user, 'rewards') ? [
            <li key='rewards'>
              <Link activeClassName='active' to='/rewards'>
                <i className='fa fa-gift p-r-1'></i>
                <span>Rewards</span>
              </Link>
            </li>,
            <li key='transaction-logs'>
              <Link activeClassName='active' to='/transaction-logs'>
                <i className='fa fa-history p-r-1'></i>
                <span>Transaction Logs</span>
              </Link>
            </li>
          ] : null}
          <li>
            <a href='#' name='appsDevices' onClick={this.toggleCollapse}>
              <i className='fa fa-plug p-r-1'></i>
              <span>My Apps and Devices</span>
            </a>
            <Collapse in={this.state.appsDevices}>
              {renderMethods(this.props.user)}
            </Collapse>
          </li>
          <li>
            <Link activeClassName='active' to='/faq'>
              <i className='fa fa-question p-r-1'></i>
              <span>FAQ</span>
            </Link>
          </li>
        </ul>
      </aside>
    )
  }
})

function renderMethods (user = {}) {
  const methods = user.methods
  if (methods && methods.length) {
    return (
      <ul id='methods-menu' className='nav nav-dark nav-pills nav-stacked'>
        {methods.map((method, ind) => {
          return (
            <li key={method}>
              <IndexLink activeClassName='active' to={`/connected/${method}`}>{method}</IndexLink>
            </li>
          )
        })}
        <li>
          <Link activeClassName='active' to='/settings'>
            <i className='fa fa-plus-square-o p-r-1'></i>
          </Link>
        </li>
      </ul>
    )
  } else {
    return (
      <ul id='methods-menu' className='nav nav-dark nav-pills nav-stacked collapse'>
        <li>
          <Link activeClassName='active' to='/settings'>
            <i className='fa fa-exclamation-circle p-r-1'></i>
            <span>Connect a device</span>
          </Link>
        </li>
      </ul>
    )
  }
}

const SidebarContainer = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    view: React.PropTypes.string,
    companies: React.PropTypes.array
  },

  render () {
    switch (this.props.view) {
      case 'admin':
        return <AdminSidebar {...this.props} />
      case 'corporate_mod':
        return <CorporateSidebar {...this.props} />
      default:
        return <Sidebar {...this.props} />
    }
  }
})

const mapStateToProps = ({ user, view, companies }) => ({ user, view, companies })

export default connect(mapStateToProps)(SidebarContainer)
