import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Helmet from 'react-helmet'
import Joi from 'joi'
import { Form, Input, TextArea, Image } from '../../components/form-components'
import RoleChecker from '../../components/role-checker.jsx'
import { requestCreateCompanyShopItem } from '../../../redux/actions/company-shop-item'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const CreateItemSchema = {
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

class ShopItemAdd extends Component {
  static propTypes = {
    requestCreateCompanyShopItem: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired,
    params: PropTypes.shape({
      companyId: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.object.isRequired
  }

  onCancelClick = () => {
    const { params, router } = this.props
    router.replace(`/company/${params.companyId}/rewards`)
  }

  onSubmit = (err, payload) => {
    if (err) return

    const { companyId } = this.props.params
    const { requestCreateCompanyShopItem, addPopTartMsg, history } = this.props

    requestCreateCompanyShopItem({ companyId }, payload)
      .then(() => {
        addPopTartMsg({message: 'Reward created', level: 'success'})
        history.push(`/company/${companyId}/rewards`)
      })
      .catch((err) => addPopTartMsg({message: err.message, level: 'error'}))
  }

  render () {
    return (
      <div>
        <Helmet htmlAttributes={{class: 'shop-item-add-page'}} />
        <div className='row'>
          <div className='col-sm-6 col-sm-offset-3'>
            <section className='panel panel-default'>
              <div className='panel-heading'>
                <h1 className='panel-title'>Create Reward</h1>
              </div>
              <div className='panel-body'>
                <Form onSubmit={this.onSubmit} schema={CreateItemSchema}>
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
const mapDispatchToProps = { requestCreateCompanyShopItem, addPopTartMsg }

const ShopItemAddContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopItemAdd))

export default function (props) {
  return (
    <RoleChecker role='corporate_mod'>
      <ShopItemAddContainer {...props} />
    </RoleChecker>
  )
}
