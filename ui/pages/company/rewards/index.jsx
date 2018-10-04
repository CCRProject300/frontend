import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { withRouter } from 'react-router'
import { requestCompanyShopItems } from '../../../../redux/actions/company-shop-items'
import { requestDeleteCompanyShopItem } from '../../../../redux/actions/company-shop-item'
import { requestCompanyCharityBuckets } from '../../../../redux/actions/company-charity-buckets'
import { requestDeleteCompanyCharityBucket } from '../../../../redux/actions/company-charity-bucket'
import { addPopTartMsg } from '../../../../redux/actions/popmsgs'
import Loading from '../../../components/loading.jsx'
import RoleChecker from '../../../components/role-checker.jsx'
import ShopItems from './items.jsx'
import CharityBuckets from './buckets.jsx'
import { hasRole } from '../../../../lib/roles'

function CompanyRewards ({
  user,
  company,
  items,
  buckets,
  loading,
  onCreateItem,
  onEditItem,
  onDeleteItem,
  onCreateBucket,
  onEditBucket,
  onDeleteBucket
}) {
  const onCreateItemClick = (e) => {
    e.preventDefault()
    onCreateItem()
  }

  const onCreateBucketClick = (e) => {
    e.preventDefault()
    onCreateBucket()
  }

  return (
    <div>
      <Helmet htmlAttributes={{ class: 'company-shop-page' }} />
      <div>
        <h2>Rewards</h2>
      </div>
      <div>
        {loading ? (
          <div className='p-a-3'><Loading /></div>
        ) : (
          <div>
            <h3 className='m-t-1' style={{ display: 'inline-block' }}>Item Rewards</h3>
            <h4 className='pull-right'>
              <a href='#' onClick={onCreateItemClick}>
                <i className='fa fa-plus-square-o'></i> Add Item Reward
              </a>
            </h4>
            {items.length ? (
              <ShopItems items={items} onEditItem={onEditItem} onDeleteItem={onDeleteItem} />
            ) : (
              <p>No items yet</p>
            )}
            {hasRole(user, 'charity-rewards') ? (
              <div>
                <h3 className='m-t-1' style={{ display: 'inline-block' }}>Charity Rewards</h3>
                <h4 className='pull-right'>
                  <a href='#' onClick={onCreateBucketClick}>
                    <i className='fa fa-plus-square-o'></i> Add Charity Reward
                  </a>
                </h4>
                {buckets.length ? (
                  <CharityBuckets buckets={buckets} onEditBucket={onEditBucket} onDeleteBucket={onDeleteBucket} />
                ) : (
                  <p>No charity rewards yet</p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

CompanyRewards.propTypes = {
  company: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  buckets: PropTypes.array.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onCreateBucket: PropTypes.func.isRequired,
  onEditBucket: PropTypes.func.isRequired,
  onDeleteBucket: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

class CompanyRewardsContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    company: PropTypes.object,
    items: PropTypes.array,
    buckets: PropTypes.array,
    requestCompanyShopItems: PropTypes.func.isRequired,
    requestDeleteCompanyShopItem: PropTypes.func.isRequired,
    requestCompanyCharityBuckets: PropTypes.func.isRequired,
    requestDeleteCompanyCharityBucket: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
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
        this.setState({ loading: false })
        addPopTartMsg({message: err.message, level: 'error'})
      })
  }

  onCreateItem = () => {
    const { company, router } = this.props
    router.push(`/company/${encodeURIComponent(company._id)}/shop/item/add`)
  }

  onEditItem = (item) => {
    const { company, router } = this.props
    router.push(`/company/${encodeURIComponent(company._id)}/shop/item/${encodeURIComponent(item._id)}`)
  }

  onDeleteItem = (item) => {
    const confirmMsg = `Are you sure you want to delete "${item.name}"?`
    if (!window.confirm(confirmMsg)) return

    const {
      company,
      requestDeleteCompanyShopItem,
      addPopTartMsg
    } = this.props

    this.setState({ loading: true })

    requestDeleteCompanyShopItem({ companyId: company._id, itemId: item._id })
      .then(() => {
        this.setState({ loading: false })
        addPopTartMsg({ message: 'Item deleted', level: 'success' })
      })
      .catch((err) => {
        this.setState({ loading: false })
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  }

  onCreateBucket = () => {
    const { company, router } = this.props
    router.push(`/company/${encodeURIComponent(company._id)}/charity/bucket/add`)
  }

  onEditBucket = (bucket) => {
    const { company, router } = this.props
    router.push(`/company/${encodeURIComponent(company._id)}/charity/bucket/${encodeURIComponent(bucket._id)}`)
  }

  onDeleteBucket = (bucket) => {
    const confirmMsg = `Are you sure you want to delete "${bucket.name}"?`
    if (!window.confirm(confirmMsg)) return

    const {
      company,
      requestDeleteCompanyCharityBucket,
      addPopTartMsg
    } = this.props

    this.setState({ loading: true })

    requestDeleteCompanyCharityBucket({ companyId: company._id, bucketId: bucket._id })
      .then(() => {
        this.setState({ loading: false })
        addPopTartMsg({ message: 'Charity reward deleted', level: 'success' })
      })
      .catch((err) => {
        this.setState({ loading: false })
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  }

  render () {
    const { user, company, items, buckets } = this.props
    const { loading } = this.state
    const {
      onCreateItem,
      onEditItem,
      onDeleteItem,
      onCreateBucket,
      onEditBucket,
      onDeleteBucket
    } = this

    if (!company) return null

    return (
      <CompanyRewards
        user={user}
        items={items}
        buckets={buckets}
        loading={loading}
        onCreateItem={onCreateItem}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        onCreateBucket={onCreateBucket}
        onEditBucket={onEditBucket}
        onDeleteBucket={onDeleteBucket} />
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
  requestDeleteCompanyShopItem,
  requestCompanyCharityBuckets,
  requestDeleteCompanyCharityBucket,
  addPopTartMsg
}

const ConnectedCompanyRewards = connect(mapStateToProps, mapDispatchToProps)(CompanyRewardsContainer)

export default withRouter(function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <RoleChecker role='rewards'>
        <ConnectedCompanyRewards {...props} />
      </RoleChecker>
    </RoleChecker>
  )
})
