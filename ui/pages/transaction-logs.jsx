import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import RoleChecker from '../components/role-checker.jsx'
import { requestTransactionLogs } from '../../redux/actions/transaction-logs.js'
import { addPopTartMsg } from '../../redux/actions/popmsgs'

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
    requestTransactionLogs: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    transactionLogs: PropTypes.arrayOf(PropTypes.object).isRequired,
    transactionLogsTotal: PropTypes.number.isRequired
  }

  componentWillMount () {
    this.props.requestTransactionLogs({ skip: 0, limit: CHUNK_SIZE })
      .catch((err) => console.error(err))
  }

  onLoadMore = () => {
    const { transactionLogs, requestTransactionLogs } = this.props
    requestTransactionLogs({ skip: transactionLogs.length, limit: CHUNK_SIZE })
  }

  render () {
    const { onLoadMore } = this
    const { transactionLogs, transactionLogsTotal } = this.props
    const canLoadMore = transactionLogs.length < transactionLogsTotal

    return (
      <section className='wrapper'>
        <Helmet htmlAttributes={{class: 'transaction-logs-page'}} />
        <h2 className='m-r-1'>Transaction Logs</h2>
        {transactionLogs.length ? (
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr className='top-leaderboard'>
                  <th>Type</th>
                  <th>KudosCoins</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactionLogs.map(({ _id, user, createdBy, kudosCoins, type, reason, createdAt }) => (
                  <tr className='leaderboard-user' key={_id}>
                    <td><i className={TransactionIconClass[type] || 'fa fa-question'} title={type} /></td>
                    <td>{kudosCoins}</td>
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
        ) : (
          <p>No transaction logs yet.</p>
        )}
      </section>
    )
  }
}

const mapStateToProps = ({ user, companies, transactionLogs, transactionLogsTotal }) => {
  return { user, companies, transactionLogs, transactionLogsTotal }
}
const mapDispatchToProps = { requestTransactionLogs, addPopTartMsg }

const TransactionLogsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionLogs))

export default function (props) {
  return (
    <RoleChecker role='rewards'>
      <TransactionLogsContainer {...props} />
    </RoleChecker>
  )
}
