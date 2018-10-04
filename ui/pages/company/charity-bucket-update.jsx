import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Helmet from 'react-helmet'
import Joi from 'joi'
import pick from 'lodash.pick'
import { Form, Input, TextArea, Image, Toggle } from '../../components/form-components'
import RoleChecker from '../../components/role-checker.jsx'
import { requestCompanyCharityBucket, requestUpdateCompanyCharityBucket } from '../../../redux/actions/company-charity-bucket'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const UpdateBucketSchema = {
  name: Joi.string().required().label('Name'),
  description: Joi.string().label('Description'),
  logo: Joi.string().uri().label('Logo'),
  image: Joi.string().uri().label('Image'),
  target: Joi.number().integer().min(1).required().label('Target'),
  autoClose: Joi.boolean().default(false).label('Auto close'),
  closed: Joi.boolean().default(false).label('Closed')
}

class CharityBucketUpdate extends Component {
  static propTypes = {
    requestCompanyCharityBucket: PropTypes.func.isRequired,
    requestUpdateCompanyCharityBucket: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    params: PropTypes.shape({
      companyId: PropTypes.string.isRequired,
      bucketId: PropTypes.string.isRequired
    }).isRequired,
    router: PropTypes.object.isRequired
  }

  state = { bucket: null }

  componentWillMount () {
    const { companyId, bucketId } = this.props.params

    this.props.requestCompanyCharityBucket({ companyId, bucketId })
      .then((bucket) => this.setState({ bucket }))
      .catch((err) => this.props.addPopTartMsg({message: err.message, level: 'error'}))
  }

  onCancelClick = () => {
    const { params, router } = this.props
    router.replace(`/company/${params.companyId}/rewards`)
  }

  onSubmit = (err, payload) => {
    if (err) return

    const { _id: bucketId } = this.state.bucket
    const { companyId } = this.props.params
    const { requestUpdateCompanyCharityBucket, addPopTartMsg, router } = this.props

    requestUpdateCompanyCharityBucket({ companyId, bucketId }, payload)
      .then(() => {
        addPopTartMsg({message: 'Reward edited', level: 'success'})
        router.push(`/company/${companyId}/rewards`)
      })
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  }

  render () {
    const { bucket } = this.state
    if (!bucket) return null

    const defaults = pick(bucket, ['name', 'description', 'logo', 'image', 'target', 'autoClose', 'closed'])

    return (
      <div>
        <Helmet htmlAttributes={{class: 'charity-bucket-add-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Edit Charity Reward</h1>
              </div>
              <div className='panel-body'>
                <Form onSubmit={this.onSubmit} schema={UpdateBucketSchema} defaults={defaults}>
                  <Input name='name' label='Name' placeholder='Charity name or collection cause' />
                  <TextArea name='description' label='Description' />
                  <Image name='logo' label='logo' opts={{
                    imagesOnly: true,
                    previewStep: true,
                    crop: true
                  }} />
                  <Image name='image' label='Image' opts={{
                    imagesOnly: true,
                    previewStep: true,
                    crop: true
                  }} />
                  <Input type='number' step={1} name='target' label='Target' placeholder='Number of KudosCoins to aim for' />
                  <Toggle name='autoClose' label='Auto close (stop accepting donations when target reached)' />
                  <Toggle name='closed' label='Closed (stop accepting donations)' />
                  <button type='submit' className='btn btn-warning btn-lg'>Submit</button>
                  <button type='button' onClick={this.onCancelClick} className='btn btn-link'>Cancel</button>
                </Form>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ user, companies }) => ({ user, companies })
const mapDispatchToProps = { requestCompanyCharityBucket, requestUpdateCompanyCharityBucket, addPopTartMsg }

const CharityBucketUpdateContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(CharityBucketUpdate))

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <RoleChecker role='charity-rewards'>
        <CharityBucketUpdateContainer {...props} />
      </RoleChecker>
    </RoleChecker>
  )
}
