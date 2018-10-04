import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Joi from 'joi'
import debounce from 'lodash.debounce'
import breakpoint from '../../lib/bootstrap-breakpoint'
import RoleChecker from '../../components/role-checker.jsx'
import { requestCreateCompanyLeague } from '../../../redux/actions/company-league'
import { requestCompanyMembers } from '../../../redux/actions/company-members'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { Form, DatePicker, Input, TextArea, MultiInput } from '../../components/form-components'
import uccdn from '../../lib/uccdn'

const schema = {
  name: Joi.string().required().label('League Name'),
  description: Joi.string().empty('').label('Description'),
  startDate: Joi.date().iso().empty(null).label('Start Date'),
  endDate: Joi.date().iso().empty(null).min(Joi.ref('startDate')).label('End Date'),
  teamSize: Joi.alternatives(Joi.any().valid(null, ''), Joi.number().min(1)).label('Team Size'),
  minTeamSize: Joi.when('teamSize', {
    is: Joi.any().valid(null, ''),
    then: Joi.number().min(1).required(),
    otherwise: Joi.number().min(1).max(Joi.ref('teamSize')).required()
  }).label('Minimum Team Size'),
  categories: Joi.when('teamSize', {
    is: 1,
    then: Joi.array().length(0),
    otherwise: Joi.array().items(Joi.string()).min(1).required()
  }).label('Categories')
}

function companyDiffers (newCompanies, oldCompanies) {
  if (!newCompanies || !newCompanies.length) return false
  if (!oldCompanies || !oldCompanies.length) return true
  return oldCompanies[0]._id !== newCompanies[0]._id
}

const CompanyLeagueAdd = React.createClass({
  getInitialState () {
    return {
      step: 'users',
      users: []
    }
  },
  nextStep (users) {
    this.setState({ step: 'details', users })
  },
  render () {
    if (this.state.step === 'users') return <CompanyLeagueAddUsersContainer onSubmit={this.nextStep} {...this.props} />
    return <CompanyLeagueAddDetailsContainer {...this.props} users={this.state.users} />
  }
})

export default function (props) {
  return (
    <div>
      <Helmet htmlAttributes={{ class: 'moderate-add-league-page' }} />
      <RoleChecker role='corporate_mod'>
        <section className='wrapper'>
          <CompanyLeagueAdd {...props} />
        </section>
      </RoleChecker>
    </div>
  )
}

const CompanyLeagueAddUsers = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func
  },
  getInitialState () {
    return {
      locations: [],
      departments: [],
      users: [],
      modified: false,
      usersShown: 8,
      searchText: '',
      searchResults: []
    }
  },
  toggle (field, item) {
    if (this.state.modified && !window.confirm('This will clear the current results. Are you sure?')) return
    const list = this.state[field]
    const present = list.indexOf(item) > -1
    const newList = present
      ? list.filter((i) => i !== item)
      : list.concat(item)
    this.setState({ [field]: newList }, this.updateFilterResults)
  },
  updateFilterResults () {
    const locations = this.state.locations
    const departments = this.state.departments
    if (!locations.length && !departments.length) return this.setState({ users: [] })
    const users = this.props.companyMembers.filter((m) => {
      if (locations.length && locations.indexOf(m.location) === -1) return false
      if (departments.length && departments.indexOf(m.department) === -1) return false
      return true
    })
    this.setState({ users, modified: false }, this.updateSearchResults)
  },
  removeUser (_id) {
    const users = this.state.users.filter((u) => u._id !== _id)
    this.setState({ users, modified: true }, this.updateSearchResults)
  },
  addUser (user) {
    const users = [user].concat(this.state.users)
    this.setState({ users, modified: true }, this.updateSearchResults)
  },
  changeSearchText (evt) {
    this.setState({ searchText: evt.currentTarget.value }, this.updateAllResultsDebounced)
  },
  updateSearchResults () {
    if (!this.state.searchText) return this.setState({ searchResults: [] })
    const regex = new RegExp(this.state.searchText, 'gi')
    const searchResults = this.props.companyMembers.filter((u) => {
      if (this.state.users.some((user) => u._id === user._id)) return false
      return regex.exec(`${u.firstName} ${u.lastName}`)
    })
    this.setState({ searchResults })
  },
  sortUsers () {
    if (!this.state.searchText) return
    const regex = new RegExp(this.state.searchText, 'gi')
    const filter = this.state.users.reduce((memo, u) => {
      if (regex.exec(`${u.firstName} ${u.lastName}`)) {
        memo.matches.push(u)
      } else {
        memo.others.push(u)
      }
      return memo
    }, { matches: [], others: [] })
    this.setState({ users: filter.matches.concat(filter.others) })
  },
  componentWillReceiveProps (nextProps) {
    if (companyDiffers(nextProps.companies, this.props.companies)) {
      this.props.requestCompanyMembers(nextProps.companies[0]._id)
    }
  },
  componentDidMount () {
    this.updateAllResultsDebounced = debounce(() => {
      this.updateSearchResults()
      this.sortUsers()
    }, 1000)
    const company = this.props.companies && this.props.companies.length && this.props.companies[0]
    if (company) this.props.requestCompanyMembers(company._id)
    this.setState({ usersShown: { xs: 3, sm: 4, 'md': 6, 'lg': 6 }[breakpoint()] })
  },
  render () {
    const company = this.props.companies[0]
    if (!company) return null
    return (
      <div>
        <div className='row'>
          <div className='col-sm-6 col-md-5 col-md-offset-1'>
            <h3>Locations</h3>
            <div className='h4'>
              {company.locations.map((loc, ind) => {
                const labelClass = this.state.locations.indexOf(loc) > -1 ? 'label-primary' : 'label-default'
                return <span
                  key={ind}
                  className={`label label-tag ${labelClass}`}
                  onClick={this.toggle.bind(this, 'locations', loc)}
                >{loc}</span>
              })}
            </div>
          </div>
          <div className='col-sm-6 col-md-5'>
            <h3>Departments</h3>
            <div className='h4'>
              {company.departments.map((dep, ind) => {
                const labelClass = this.state.departments.indexOf(dep) > -1 ? 'label-primary' : 'label-default'
                return <span
                  key={ind}
                  className={`label label-tag ${labelClass}`}
                  onClick={this.toggle.bind(this, 'departments', dep)}
                >{dep}</span>
              })}
            </div>
          </div>
        </div>
        <div className='row m-t-1'>
          <div className='col-md-10 col-md-offset-1'>
            <div className='input-group m-b-1'>
              <input type='text' className='form-control' placeholder='Search for user...'value={this.state.searchText} onChange={this.changeSearchText} />
              <span className='input-group-btn'>
                <button className='btn btn-default' type='button'><i className='fa fa-search'></i></button>
              </span>
            </div>
            <div className='row'>
              {this.state.searchResults.slice(0, this.state.usersShown).map((u, ind) => {
                return <UserItem key={ind} user={u} addUser={this.addUser} />
              })}
            </div>
          </div>
        </div>
        <hr />
        <div className='row'>
          {this.state.users.length
            ? (<div className='col-md-10 col-md-offset-1'>
              <h3>Selected users</h3>
            </div>)
            : ''
          }
          <div className='col-md-10 col-md-offset-1'>
            <div className='row'>
              {this.state.users.slice(0, this.state.usersShown).map((u, ind) => {
                return <UserCard key={ind} user={u} removeUser={this.removeUser} />
              })}
            </div>
          </div>
          {this.state.users.length > this.state.usersShown
            ? <div className='h5 col-xs-12 text-center'><em>and another {this.state.users.length - this.state.usersShown} users</em></div>
            : ''
          }
        </div>
        <hr />
        <div className='row'>
          <div className='col-md-6 col-md-offset-3 text-right'>
            <button type='button' className='btn btn-lg btn-primary' onClick={() => this.props.onSubmit(this.state.users.map((u) => u._id))}>Next</button>
          </div>
        </div>
      </div>
    )
  }
})

const UserCard = ({ user, removeUser }) => {
  const name = `${user.firstName} ${user.lastName}`
  const avatar = user.avatar
    ? uccdn(user.avatar, '-/scale_crop/160x160/center/-/quality/lighter/')
    : 'https://www.gravatar.com/avatar?d=mm&s=160'

  return (
    <div className='col-sm-6 col-md-4'>
      <div className='media user-card m-b-1' onClick={() => { removeUser(user._id) }}>
        <div className='media-left'>
          <img className='media-object' src={avatar} alt={name} style={{ height: '80px' }} />
        </div>
        <div className='media-body'>
          <h4 className='media-heading'>{name}</h4>
          <h6>{user.department}</h6>
          <h6>{user.location}</h6>
        </div>
      </div>
    </div>
  )
}

const UserItem = ({ user, addUser }) => {
  const name = `${user.firstName} ${user.lastName}`
  const avatar = user.avatar
    ? uccdn(user.avatar, '-/scale_crop/70x70/center/-/quality/lighter/')
    : 'https://www.gravatar.com/avatar?d=mm&s=70'

  return (
    <div className='col-sm-3'>
      <div className='user-item' onClick={() => addUser(user)}>
        <img src={avatar} alt={name} />
        <div className='text h5' >{name} <i className='fa fa-plus'></i></div>
      </div>
    </div>
  )
}

const mapStateToPropsForUsers = ({ companies, companyMembers }) => ({ companies, companyMembers })
const mapDispatchToPropsForUsers = { requestCompanyMembers }

const CompanyLeagueAddUsersContainer = connect(mapStateToPropsForUsers, mapDispatchToPropsForUsers)(CompanyLeagueAddUsers)

const CompanyLeagueAddDetails = React.createClass({
  propTypes: {
    requestCreateCompanyLeague: React.PropTypes.func.isRequired,
    addPopTartMsg: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      companyId: React.PropTypes.string.isRequired
    }).isRequired
  },
  getInitialState () {
    const { teamSize, minTeamSize } = this.getDefaultTeamSizes()
    return { showCategories: !teamSize || teamSize > 1, teamSize, minTeamSize }
  },
  getDefaultTeamSizes () {
    return { teamSize: 5, minTeamSize: 3 }
  },
  submitLeague (err, payload) {
    if (err) {
      return this.props.addPopTartMsg({ message: err.details[0].message, level: 'error' })
    }
    const companyId = this.props.params.companyId
    payload.users = this.props.users
    if (!payload.teamSize) payload.teamSize = null
    if (payload.teamSize === 1) delete payload.minTeamSize

    this.props.requestCreateCompanyLeague({ companyId, payload })
      .then(() => {
        this.props.addPopTartMsg({message: 'League added', level: 'success'})
        browserHistory.push(`/company/${encodeURIComponent(companyId)}/leagues`)
      })
      .catch((err) => {
        const message = err.message || 'Failed to add league'
        this.props.addPopTartMsg({message, level: 'error'})
      })
  },
  onChange (name, value) {
    if (name !== 'teamSize') return
    this.setState({ showCategories: (value !== '1'), teamSize: parseInt(value, 10) })
  },
  render () {
    const { teamSize } = this.state

    return (
      <section className='wrapper'>
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <h1>Create Company League</h1>
            <Form id='new-league-form' onSubmit={this.submitLeague} onChange={this.onChange} schema={schema} defaults={this.getDefaultTeamSizes()}>
              <Input name='name' label='League Name' />
              <TextArea name='description' label='Description' />
              <DatePicker name='startDate' label='Start Date' dateFormat='DD/MM/YYYY' />
              <DatePicker name='endDate' label='End Date' dateFormat='DD/MM/YYYY' />
              <Input name='teamSize' label='Team Size (leave blank for unlimited)' type='number' min={1} step={1} />
              <Input name='minTeamSize' label='Minimum Size (no points scored until team has this many members)' type='number' min={1} max={teamSize || Infinity} step={1} />
              {this.state.showCategories ? <MultiInput name='categories' label='Categories' placeholder='Add a team category' /> : ''}
              <input className='btn btn-warning btn-lg' type='submit' value='Submit' />
            </Form>
          </div>
        </div>
      </section>
    )
  }
})

const mapDispatchToPropsForDetails = { requestCreateCompanyLeague, addPopTartMsg }

const CompanyLeagueAddDetailsContainer = connect(null, mapDispatchToPropsForDetails)(CompanyLeagueAddDetails)
