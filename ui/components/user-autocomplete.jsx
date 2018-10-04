import React from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import uccdn from '../lib/uccdn'
import { requestSearchUsers } from '../../redux/actions/search-users'

const UserSuggestion = ({ user, onClick }) => {
  const { firstName, lastName, avatar = 'https://www.gravatar.com/avatar?d=mm&s=80', location, department } = user
  const qualifier = [location, department].filter((i) => i).join(', ')

  return (
    <a href='#' className='list-group-item' onClick={() => onClick(user)}>
      <img src={uccdn(avatar, '-/scale_crop/80x80/center/-/quality/lighter/')} height='40' className='d-inline-block' style={{ minWidth: '40px' }} />
      <span className='d-inline-block m-l-1'>
        {firstName} {lastName}
        {qualifier ? ` (${qualifier})` : ''}
      </span>
    </a>
  )
}

const UserAutocomplete = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    requestSearchUsers: React.PropTypes.func.isRequired,
    companyId: React.PropTypes.string
  },

  getInitialState () {
    return {
      matches: [],
      searchTerm: ''
    }
  },

  changeSearchTerm (evt) {
    this.setState({ searchTerm: evt.target.value }, this.getMatches)
  },

  getMatches: debounce(function () {
    const { props: { companyId }, state: { searchTerm } } = this
    if (!searchTerm) return this.setState({ matches: [] })

    let searchParams = { q: searchTerm }
    if (companyId) searchParams.companyId = companyId

    this.props.requestSearchUsers(searchParams)
      .then((matches) => this.setState({ matches }))
  }, 500),

  render () {
    const {
      changeSearchTerm,
      state: { searchTerm },
      props: { onClick }
    } = this

    return (
      <div style={{ position: 'relative' }}>
        <input type='text' className='form-control' id='search' placeholder='Add users by name, username or email' value={searchTerm} onChange={changeSearchTerm} />
        <div className='list-group' id='suggestions' style={{ position: 'absolute', width: '100%' }}>
          {this.state.matches.map((user, ind) => <UserSuggestion user={user} key={ind} onClick={onClick} />)}
        </div>
      </div>
    )
  }
})

const mapDispatchToProps = { requestSearchUsers }

export default connect(null, mapDispatchToProps)(UserAutocomplete)
