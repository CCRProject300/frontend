import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import RoleChecker from '../../components/role-checker.jsx'
import Avatar from '../../components/avatar.jsx'
import { requestCompanyTransactionLogs } from '../../../redux/actions/company-transaction-logs.js'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const CHUNK_SIZE = 20

const TransactionIconClass = {
  purchase: 'fa fa-shopping-cart',
  distribution: 'fa fa-gift',
  donation: 'fa fa-heart',
  'daily-coin': 'fa fa-calendar',
  activity: 'fa fa-bicycle',
  'activity-ajustment': 'fa fa-wrench'
}

class TransactionLogs extends Component {
  static propTypes = {
    requestCompanyTransactionLogs: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    params: PropTypes.shape({
      companyId: PropTypes.string.isRequired
    }).isRequired,
    companyTransactionLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
    companyTransactionLogCount: PropTypes.number.isRequired
  }

  state = {
    skip: 0
  }

  componentWillMount () {
    this.props.requestCompanyTransactionLogs({ companyId: this.props.params.companyId, skip: this.state.skip, limit: CHUNK_SIZE })
      .catch((err) => console.error(err))
  }

  onLoadMore = () => {
    this.setState(({ skip }) => ({ skip: skip + CHUNK_SIZE }), () => {
      this.props.requestCompanyTransactionLogs({ companyId: this.props.params.companyId, skip: this.state.skip, limit: CHUNK_SIZE })
    })
  }

  render () {
    const { onLoadMore } = this
    const { companyTransactionLogs, companyTransactionLogCount } = this.props
    const canLoadMore = companyTransactionLogCount > this.state.skip + CHUNK_SIZE

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'company-transaction-logs-page'}} />
        <h2 className='m-r-1'>Transaction Logs</h2>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr className='top-leaderboard'>
                <th>Type</th>
                <th>User</th>
                <th>KudosCoins</th>
                <th>Created By</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {companyTransactionLogs.map(({ _id, user, createdBy, kudosCoins, type, reason, createdAt }) => (
                <tr className='leaderboard-user' key={_id}>
                  <td><i className={TransactionIconClass[type] || 'fa fa-question'} title={type} /></td>
                  <td className='truncate' title={`${user.firstName} ${user.lastName}`}><Avatar user={user} /> {user.firstName} {user.lastName}</td>
                  <td>{kudosCoins}</td>
                  <td className='truncate' title={`${createdBy.firstName} ${createdBy.lastName}`}><Avatar user={createdBy} /> {createdBy.firstName} {createdBy.lastName}</td>
                  <td className='truncate' title={reason}>{reason}</td>
                  <td className='truncate' title={moment(createdAt).format('lll')}>{moment(createdAt).format('llll')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {canLoadMore
            ? <div className='text-center'><button className='btn btn-primary' onClick={onLoadMore}>Load More</button></div>
            : null
          }
        </div>
      </section>
    )
  }
}

const mapStateToProps = ({ user, companies, companyTransactionLogs, companyTransactionLogCount }) => {
  return { user, companies, companyTransactionLogs, companyTransactionLogCount }
}
const mapDispatchToProps = { requestCompanyTransactionLogs, addPopTartMsg }

const TransactionLogsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionLogs))

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <TransactionLogsContainer {...props} />
    </RoleChecker>
  )
}
