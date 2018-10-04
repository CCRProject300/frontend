import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Helmet from 'react-helmet'
import Joi from 'joi'
import pick from 'lodash.pick'
import { Form, Input, TextArea, Image } from '../../components/form-components'
import RoleChecker from '../../components/role-checker.jsx'
import { requestCompanyShopItem, requestUpdateCompanyShopItem } from '../../../redux/actions/company-shop-item'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const UpdateItemSchema = {
  name: Joi.string().required().label('Name'),
  description: Joi.string().label('Description'),
  image: Joi.string().uri().label('Image'),
  price: Joi.number().integer().min(0).required().label('Price'),
  stockLevel: Joi.number().integer().min(0).required().label('Stock level')
}

const UploadcareOptions = {
  imagesOnly: true,
  previewStep: true,
  crop: '1:1'
}

class ShopItemUpdate extends Component {
  static propTypes = {
    requestCompanyShopItem: PropTypes.func.isRequired,
    requestUpdateCompanyShopItem: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    params: PropTypes.shape({
      companyId: PropTypes.string.isRequired,
      itemId: PropTypes.string.isRequired
    }).isRequired,
    router: PropTypes.object.isRequired
  }

  state = { item: null }

  componentWillMount () {
    const { companyId, itemId } = this.props.params

    this.props.requestCompanyShopItem({ companyId, itemId })
      .then((item) => this.setState({ item }))
      .catch((err) => this.props.addPopTartMsg({message: err.message, level: 'error'}))
  }

  onCancelClick = () => {
    const { params, router } = this.props
    router.replace(`/company/${params.companyId}/rewards`)
  }

  onSubmit = (err, payload) => {
    if (err) return

    const { _id: itemId } = this.state.item
    const { companyId } = this.props.params
    const { requestUpdateCompanyShopItem, addPopTartMsg, router } = this.props

    requestUpdateCompanyShopItem({ companyId, itemId }, payload)
      .then(() => {
        addPopTartMsg({message: 'Reward edited', level: 'success'})
        router.push(`/company/${companyId}/rewards`)
      })
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  }

  render () {
    const { item } = this.state
    if (!item) return null

    const defaults = pick(item, ['name', 'description', 'image', 'price', 'stockLevel'])

    return (
      <div>
        <Helmet htmlAttributes={{class: 'shop-item-add-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Edit Reward</h1>
              </div>
              <div className='panel-body'>
                <Form onSubmit={this.onSubmit} schema={UpdateItemSchema} defaults={defaults}>
                  <Input name='name' label='Name' />
                  <TextArea name='description' label='Description' />
                  <Image name='image' label='Image' opts={UploadcareOptions} />
                  <Input name='price' label='Price' />
                  <Input name='stockLevel' label='Stock level' />
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
const mapDispatchToProps = { requestCompanyShopItem, requestUpdateCompanyShopItem, addPopTartMsg }

const ShopItemUpdateContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopItemUpdate))

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <ShopItemUpdateContainer {...props} />
    </RoleChecker>
  )
}
