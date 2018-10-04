import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import formatNumber from 'simple-format-number'
import { Link } from 'react-router'
import { requestCompanyCharityBucketDonate } from '../../../redux/actions/company-charity-bucket-donate'
import { requestCompanyCharityBucket } from '../../../redux/actions/company-charity-bucket'
import { requestCompanyCharityBuckets } from '../../../redux/actions/company-charity-buckets'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import Loading from '../../components/loading.jsx'
import RoleChecker from '../../components/role-checker.jsx'
import uccdn from '../../lib/uccdn'
import DonateButton from './donate-button.jsx'
import DonationsGraph from './donations-graph.jsx'
import { LeftArrow, RightArrow } from './arrows.jsx'

function CharityBucket ({ user, loading, bucket, buckets, onDonate }) {
  if (loading) return <div className='p-a-3'><Loading /></div>
  if (!bucket) return null

  const formattedCoins = formatNumber(user.kudosCoins, { fractionDigits: 0 })
  const formattedTarget = formatNumber(bucket.target, { fractionDigits: 0 })
  const targetReached = bucket.total >= bucket.target

  const currentIndex = buckets.findIndex((b) => b._id === bucket._id)

  let prevLink = null
  let nextLink = null

  if (currentIndex > -1 && buckets.length > 1) {
    const prevBucket = buckets[currentIndex === 0 ? buckets.length - 1 : currentIndex - 1]
    const nextBucket = buckets[currentIndex === buckets.length - 1 ? 0 : currentIndex + 1]
    prevLink = (
      <Link className='prev arrow' to={`/charity/${prevBucket._id}`} title='Previous charity'>
        <LeftArrow />
      </Link>
    )
    nextLink = (
      <Link className='next arrow' to={`/charity/${nextBucket._id}`} title='Next charity'>
        <RightArrow />
      </Link>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <Helmet
        htmlAttributes={{ class: 'charity-bucket-page' }}
        style={[
          { cssText: `
              #main-content {
                padding-bottom: 0 !important;
                background-size: cover;
                background-position: center;
                background-image: ${bucket.image ? `url("${bucket.image}")` : 'none'};
              }
            ` }
        ]} />
      <div className='row'>
        <div className='col-md-6 hidden-xs hidden-sm' style={{ height: '100vh' }}>
          <div className='text-center' style={{ position: 'absolute', top: '70%', width: '100%' }}>
            <div className='panel panel-default' style={{ display: 'inline-block' }}>
              <div className='panel-body'>
                {bucket.closed ? (
                  <h2 className='h3 m-y-1'>Closed for Donations</h2>
                ) : (
                  <div>
                    <div className='m-b-1'>
                      <DonateButton
                        maxAmount={getMaxAmount(user, bucket)}
                        onDonate={(amount) => onDonate(bucket, amount)} />
                    </div>
                    {formattedCoins} <span className='coin' /> available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6 p-t-2' style={{ backgroundColor: 'rgba(255,255,255,0.85)', marginTop: '-15px', minHeight: '100vh', paddingBottom: '90px' }}>
          <Link to={'/rewards'} className='close p-x'>&times;</Link>
          {bucket.logo ? (
            <div className='text-center m-b-2'>
              <img
                style={{ maxWidth: '100%', maxHeight: '100px' }}
                src={uccdn(bucket.logo, '-/resize/x200/-/quality/lighter/')} />
            </div>
          ) : null}
          <h1 className='h4 text-center text-primary'>{bucket.name}</h1>
          <p className='text-primary text-center'>Target {targetReached ? 'reached!' : <strong>{formattedTarget}</strong>} {targetReached ? null : 'KudosCoins'}</p>
          <DonationsGraph donations={bucket.donations} target={bucket.target} total={bucket.total} />
          {bucket.description ? (
            <p className='text-primary'>{bucket.description}</p>
          ) : null}
          <div className='text-center visible-xs visible-sm'>
            {bucket.closed ? (
              <h2 className='h3 m-y-1'>Closed for Donations</h2>
            ) : (
              <div>
                <div className='m-b-1'>
                  <DonateButton
                    maxAmount={getMaxAmount(user, bucket)}
                    onDonate={(amount) => onDonate(bucket, amount)} />
                </div>
                {formattedCoins} <span className='coin' /> available
              </div>
            )}
          </div>
        </div>
      </div>
      {prevLink}
      {nextLink}
    </div>
  )
}

CharityBucket.propTypes = {
  user: PropTypes.object.isRequired,
  bucket: PropTypes.object,
  buckets: PropTypes.array.isRequired,
  onDonate: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

function getMaxAmount (user, bucket) {
  const userCoins = user.kudosCoins || 0
  if (!bucket.autoClose) return userCoins
  const remaining = bucket.target - bucket.total
  return remaining < 0 ? 0 : Math.min(userCoins, remaining)
}

class CharityBucketContainer extends Component {
  static propTypes = {
    company: PropTypes.object,
    user: PropTypes.object,
    items: PropTypes.array,
    buckets: PropTypes.array,
    requestCompanyCharityBucket: PropTypes.func.isRequired,
    requestCompanyCharityBuckets: PropTypes.func.isRequired,
    requestCompanyCharityBucketDonate: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    params: PropTypes.shape({
      bucketId: PropTypes.string.isRequired
    })
  }

  state = { loading: true, bucket: null }

  componentDidMount () {
    this.requestBuckets(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const { company } = this.props
    const { company: nextCompany } = nextProps

    // Received a company
    if (!company && nextCompany) {
      this.requestBuckets(nextProps)
    // Company changed
    } else if (company && nextCompany && company._id !== nextCompany._id) {
      this.requestBuckets(nextProps)
    // Bucket changed
    } else if (this.state.bucket && nextProps.params.bucketId !== this.state.bucket._id) {
      this.requestBuckets(nextProps)
    }
  }

  requestBuckets (props) {
    const {
      company,
      requestCompanyCharityBucket,
      requestCompanyCharityBuckets,
      addPopTartMsg,
      params
    } = props

    if (!company) return

    this.setState({ loading: true })

    return Promise
      .all([
        requestCompanyCharityBucket({ companyId: company._id, bucketId: params.bucketId }),
        requestCompanyCharityBuckets(company._id)
      ])
      .then((results) => this.setState({ loading: false, bucket: results[0] }))
      .catch((err) => {
        this.setState({ loading: false })
        addPopTartMsg({message: err.message, level: 'error'})
      })
  }

  onDonate = (bucket, amount) => {
    const {
      company,
      requestCompanyCharityBucketDonate,
      addPopTartMsg
    } = this.props

    requestCompanyCharityBucketDonate({ companyId: company._id, bucketId: bucket._id }, { amount })
      .then(({ bucket }) => {
        addPopTartMsg({message: `Donated ${amount} KudosCoins to "${bucket.name}"`, level: 'success'})
        this.setState({ bucket })
      })
      .catch((err) => {
        this.setState({ loading: false })
        addPopTartMsg({message: err.message, level: 'error'})
      })
  }

  render () {
    const { onDonate } = this
    const { user, buckets } = this.props
    const { loading, bucket } = this.state

    return (
      <CharityBucket
        user={user}
        bucket={bucket}
        buckets={buckets}
        loading={loading}
        onDonate={onDonate} />
    )
  }
}

const mapStateToProps = ({ user, companies, companyCharityBuckets }) => {
  const company = companies[0]
  const filterByCompany = (obj) => company && obj.company._id === company._id
  return {
    user,
    company,
    buckets: companyCharityBuckets.filter(filterByCompany)
  }
}

const mapDispatchToProps = {
  requestCompanyCharityBucketDonate,
  requestCompanyCharityBucket,
  requestCompanyCharityBuckets,
  addPopTartMsg
}

const ConnectedCharityBucket = connect(mapStateToProps, mapDispatchToProps)(CharityBucketContainer)

export default function (props) {
  return (
    <RoleChecker role='rewards'>
      <ConnectedCharityBucket {...props} />
    </RoleChecker>
  )
}
