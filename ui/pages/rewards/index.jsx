import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import formatNumber from 'simple-format-number'
import { requestCompanyShopItems } from '../../../redux/actions/company-shop-items'
import { requestCompanyShopItemBuy } from '../../../redux/actions/company-shop-item-buy'
import { requestCompanyCharityBuckets } from '../../../redux/actions/company-charity-buckets'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import ShopItems from './items.jsx'
import CharityBuckets from './buckets.jsx'
import Loading from '../../components/loading.jsx'
import RoleChecker from '../../components/role-checker.jsx'
import { hasRole } from '../../../lib/roles'

function Rewards ({ user, loading, items, buckets, onItemBuy }) {
  const coins = (user && user.kudosCoins) || 0
  const formattedCoins = formatNumber(coins, { fractionDigits: 0 })

  return (
    <div>
      <Helmet htmlAttributes={{ class: 'rewards-page' }} />
      <div className='row'>
        <div className='col-sm-6 col-sm-push-6 text-right'>
          <div className='panel panel-default' title={`You have ${formattedCoins} KudosCoins`} style={{ display: 'inline-block' }}>
            <div className='panel-body'>
              <span>
                <span style={{ fontSize: '32px', verticalAlign: 'middle' }} className='m-r-1'>{formattedCoins}</span>
                <span className='coin coin-lg'></span>
              </span>
            </div>
          </div>
        </div>
        <div className='col-sm-6 col-sm-pull-6'>
          <h2>Rewards</h2>
          <p>Exchange your KudosCoins for these great rewards:</p>
        </div>
      </div>
      {loading ? (
        <div className='p-a-3'><Loading /></div>
      ) : (
        <div>
          {hasRole(user, 'charity-rewards') && buckets.length ? (
            <div>
              <h3 className='m-t-1 m-b-3'>Charity Rewards</h3>
              <CharityBuckets buckets={buckets} />
            </div>
          ) : null}
          <h3 className='m-t-1 m-b-3'>Item Rewards</h3>
          {items.length ? (
            <ShopItems user={user} items={items} onItemBuy={onItemBuy} />
          ) : (
            <p>No items yet</p>
          )}
        </div>
      )}
    </div>
  )
}

Rewards.propTypes = {
  user: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onItemBuy: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

class RewardsContainer extends Component {
  static propTypes = {
    company: PropTypes.object,
    user: PropTypes.object,
    items: PropTypes.array,
    buckets: PropTypes.array,
    requestCompanyShopItems: PropTypes.func.isRequired,
    requestCompanyShopItemBuy: PropTypes.func.isRequired,
    requestCompanyCharityBuckets: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired
  }

  state = { loading: true }

  componentDidMount () {
    this.requestRewards(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const { company } = this.props
    const { company: nextCompany } = nextProps

    // Received a company
    if (!company && nextCompany) {
      this.requestRewards(nextProps)
    // Company changed
    } else if (company && nextCompany && company._id !== nextCompany._id) {
      this.requestRewards(nextProps)
    }
  }

  requestRewards (props) {
    const {
      user,
      company,
      requestCompanyShopItems,
      requestCompanyCharityBuckets,
      addPopTartMsg
    } = props

    if (!company) return

    this.setState({ loading: true })

    const requests = [requestCompanyShopItems(company._id)]

    if (hasRole(user, 'charity-rewards')) {
      requests.push(requestCompanyCharityBuckets(company._id))
    }

    return Promise
      .all(requests)
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        console.error('Failed to request rewards', err)
        this.setState({ loading: false })
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  }

  onItemBuy = (item) => {
    const confirmMsg = `Are you sure you want to buy "${item.name}" for ${item.price} KudosCoins?`
    if (!window.confirm(confirmMsg)) return

    const {
      company,
      requestCompanyShopItemBuy,
      addPopTartMsg
    } = this.props

    this.setState({ loading: true })

    requestCompanyShopItemBuy(company._id, item._id)
      .then(() => {
        this.setState({ loading: false })
        addPopTartMsg({message: `"${item.name}" was successfully bought for ${item.price} KudosCoins`, level: 'success'})
      })
      .catch((err) => {
        this.setState({ loading: false })
        addPopTartMsg({message: err.message, level: 'error'})
      })
  }

  render () {
    const { onItemBuy } = this
    const { user, items, buckets } = this.props
    const { loading } = this.state

    return (
      <Rewards
        user={user}
        items={items}
        buckets={buckets}
        loading={loading}
        onItemBuy={onItemBuy} />
    )
  }
}

const mapStateToProps = ({ user, companies, companyShopItems, companyCharityBuckets }) => {
  const company = companies[0]
  const filterByCompany = (obj) => company && obj.company._id === company._id
  return {
    user,
    company,
    items: companyShopItems.filter(filterByCompany),
    buckets: companyCharityBuckets.filter(filterByCompany)
  }
}

const mapDispatchToProps = {
  requestCompanyShopItems,
  requestCompanyShopItemBuy,
  requestCompanyCharityBuckets,
  addPopTartMsg
}

const ConnectedRewards = connect(mapStateToProps, mapDispatchToProps)(RewardsContainer)

export default function (props) {
  return (
    <RoleChecker role='rewards'>
      <ConnectedRewards {...props} />
    </RoleChecker>
  )
}
