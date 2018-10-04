import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Joi from 'joi-browser'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Form, Input } from '../../components/form-components'
import RoleChecker from '../../components/role-checker.jsx'
import { hasRole } from '../../../lib/roles'
import { requestCompanies } from '../../../redux/actions/companies'
import { requestCompanyMembers } from '../../../redux/actions/company-members'
import { requestDeleteCompanyMember } from '../../../redux/actions/company-member'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { requestDistributeCompanyMembersCoins } from '../../../redux/actions/company-members-coins'
import { requestCompanyTokens, requestNewCompanyToken, requestRevokeCompanyToken } from '../../../redux/actions/company-tokens'

const modalSchema = {
  kudosCoins: Joi.number().integer().min(1).label('kudosCoins').required(),
  reason: Joi.string().label('reason').required()
}

let KudosCoinsModal = React.createClass({
  propTypes: {
    modalShown: PropTypes.bool.isRequired,
    selectedCount: PropTypes.number.isRequired,
    hideModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  },

  render () {
    const { modalShown, selectedCount, hideModal, onSubmit } = this.props

    return (
      <Modal show={modalShown} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Distribute KudosCoins</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are distributing KudosCoins to <strong>{selectedCount}</strong> company employees.</p>
          <Form schema={modalSchema} defaults={{ kudosCoins: 1, reason: '' }} onSubmit={onSubmit} >
            <Input label='Number of KudosCoins' name='kudosCoins' type='number' placeholder='1' min='1' />
            <Input label='Reason' name='reason' type='text' placeholder="Because I'm feeling generous" />
            <button type='submit' className='btn btn-warning'>Distribute</button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
})

const CompanyMembers = React.createClass({
  propTypes: {
    user: PropTypes.object,
    companies: PropTypes.array,
    companyMembers: PropTypes.array,
    requestCompanies: PropTypes.func,
    requestCompanyMembers: PropTypes.func,
    requestDeleteCompanyMember: PropTypes.func,
    requestCompanyTokens: PropTypes.func,
    requestNewCompanyToken: PropTypes.func,
    requestRevokeCompanyToken: PropTypes.func,
    requestDistributeCompanyMembersCoins: PropTypes.func.isRequired,
    companyTokens: PropTypes.array,
    addPopTartMsg: PropTypes.func
  },

  getInitialState () {
    return {
      selected: new Set([]),
      modalShown: false
    }
  },

  getDefaultProps () {
    return { companies: [], companyMembers: [] }
  },

  componentDidMount () {
    const company = this.props.companies.find((c) => c._id === this.props.params.companyId)

    if (company) {
      this.props.requestCompanyMembers(company._id)
      this.props.requestCompanyTokens(company._id)
    } else {
      this.props.requestCompanies().then((companies) => {
        if (!companies || !companies.length) return
        this.props.requestCompanyMembers(companies[0]._id)
        this.props.requestCompanyTokens(companies[0]._id)
      })
    }
  },

  removeMember (member) {
    if (!window.confirm('Are you sure you want to remove this member?')) return

    const companyId = this.props.companies[0]._id
    const userId = member._id

    this.props.requestDeleteCompanyMember({ companyId, userId })
      .then(() => {
        this.props.addPopTartMsg({message: 'Member removed', level: 'success'})
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  isSelected (member) {
    return this.state.selected.has(member)
  },

  isAllSelected () {
    return this.state.selected.size === this.props.companyMembers.length
  },

  toggleSelected (member) {
    const selected = new Set(this.state.selected)
    if (this.isSelected(member)) {
      selected.delete(member)
    } else {
      selected.add(member)
    }
    this.setState({ selected })
  },

  toggleAllSelected () {
    let selected
    if (this.isAllSelected()) {
      selected = new Set([])
    } else {
      selected = new Set(this.props.companyMembers)
    }
    this.setState({ selected })
  },

  showModal () {
    this.setState({ modalShown: true })
  },

  hideModal () {
    this.setState({ modalShown: false })
  },

  distributeCoins (err, data) {
    if (err) return this.props.addPopTartMsg({message: err.message, level: 'error'})

    const companyId = this.props.companies[0]._id
    const userIds = Array.from(this.state.selected).map(({ _id }) => _id)

    this.props.requestDistributeCompanyMembersCoins(Object.assign({ companyId, userIds }, data))
      .then(() => {
        this.props.addPopTartMsg({message: 'Coins distributed', level: 'success'})
        this.hideModal()
      })
      .catch((err) => {
        this.props.addPopTartMsg({message: err.message, level: 'error'})
      })
  },

  render () {
    const { isSelected, isAllSelected, toggleSelected, toggleAllSelected, hideModal, distributeCoins } = this
    const { modalShown, selected } = this.state
    const company = this.props.companies && this.props.companies[0]
    if (!company) return null

    const members = this.props.companyMembers
    const lineStyle = {
      height: '24px',
      lineHeight: '24px',
      paddingTop: 0,
      paddingBottom: 0
    }

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{ class: 'moderate-members-page' }} />
        <div className='row'>
          <div className='col-md-2 col-sm-3'>
            <img src={company.logo} style={{width: '100%'}} />
          </div>
          <div className='col-md-10 col-sm-9'>
            <h3>{company.name}</h3>
            <p className='lead'>{company.description}</p>
          </div>
        </div>
        <div style={{ clear: 'both' }}></div>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <div className='panel-title'>Invitation links</div>
          </div>
          <div className='panel-body'>
            <ul className='list-group'>
              {this.props.companyTokens.map((token, ind) => {
                return (
                  <li className='list-group-item' key={ind}>
                    <div className='pull-left' style={lineStyle}>{window.location.origin}/signup?token={token}</div>
                    <button className='btn btn-danger btn-sm pull-right' style={lineStyle} onClick={this.props.requestRevokeCompanyToken.bind(null, company._id, token)}>
                      <i className='fa fa-remove'></i>
                    </button>
                    <div className='clearfix'></div>
                  </li>
                )
              })}
            </ul>
            <div className='btn btn-primary' onClick={this.props.requestNewCompanyToken.bind(null, company._id)}>New invitation link</div>
          </div>
        </div>
        <div>
          <Link className='pull-left' to={`/company/${company._id}/members/add`}>
            <h3>
              <i className='fa fa-plus-square-o'></i> Add Employees
            </h3>
          </Link>
          {hasRole(this.props.user, 'rewards') ? (
            <button className='btn btn-warning pull-right m-t-1' onClick={this.showModal} disabled={!this.state.selected.size}>
              Distribute KudosCoins
            </button>
          ) : null}
        </div>
        <div className='clearfix' />
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr className='top-leaderboard'>
                <th><input type='checkbox' checked={isAllSelected()} onChange={() => toggleAllSelected()} /></th>
                <th>Name</th>
                <th>Activated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, ind) => {
                return (
                  <tr className='leaderboard-user' key={ind}>
                    <td><input type='checkbox' checked={isSelected(member)} onChange={() => toggleSelected(member)} /></td>
                    <td>{`${member.firstName} ${member.lastName}`}</td>
                    <td>{member.activated ? 'true' : 'false'}</td>
                    <td>
                      <button type='button' className='btn btn-danger pull-right remove-user' onClick={this.removeMember.bind(this, member)}>
                        <i className='fa fa-trash-o'></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <KudosCoinsModal modalShown={modalShown} selectedCount={selected.size} hideModal={hideModal} onSubmit={distributeCoins} />
      </section>
    )
  }
})

const mapStateToProps = ({ user, companies, companyMembers, companyTokens }) => ({ user, companies, companyMembers, companyTokens })
const mapDispatchToProps = {
  requestCompanies,
  requestCompanyMembers,
  requestDeleteCompanyMember,
  addPopTartMsg,
  requestCompanyTokens,
  requestNewCompanyToken,
  requestRevokeCompanyToken,
  requestDistributeCompanyMembersCoins
}

const CompanyMembersContainer = connect(mapStateToProps, mapDispatchToProps)(CompanyMembers)

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <CompanyMembersContainer {...props} />
    </RoleChecker>
  )
}
