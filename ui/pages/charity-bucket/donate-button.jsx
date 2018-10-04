import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from '../../components/form-components'
import Joi from 'joi'
import { connect } from 'react-redux'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'

const DonateSchema = {
  amount: Joi.number().integer().min(1).required().label('Amount')
}

class DonateButton extends Component {
  static propTypes = {
    maxAmount: PropTypes.number,
    onDonate: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired
  }

  static defaultProps = {
    maxAmount: 0
  }

  state = { open: false }

  onDonateClick = () => this.setState({ open: true })

  onSubmit = (err, payload) => {
    if (err) return

    const { amount } = payload
    const { addPopTartMsg, onDonate, maxAmount } = this.props

    if (amount > maxAmount) {
      return addPopTartMsg({ message: `Maximum donation is ${maxAmount} KudosCoins`, level: 'error' })
    }

    const confirmed = window.confirm(`Are you sure you want to donate ${amount} KudosCoins?`)
    if (!confirmed) return

    onDonate(amount)
    this.setState({ open: false })
  }

  onCancelClick = () => this.setState({ open: false })

  render () {
    const { onDonateClick, onSubmit, onCancelClick } = this
    const { open } = this.state
    const { maxAmount } = this.props

    if (maxAmount === 0) {
      return (
        <button type='button' className='btn btn-primary btn-lg' disabled>
          Donate Now
        </button>
      )
    }

    if (!open) {
      return (
        <button type='button' className='btn btn-primary btn-lg' onClick={onDonateClick}>
          Donate Now
        </button>
      )
    }

    return (
      <Form onSubmit={onSubmit} schema={DonateSchema} className='form-inline'>
        <Input name='amount' placeholder='How many KudosCoins?' className='form-control m-r-2' style={{ minWidth: '190px' }} />
        <button type='submit' className='btn btn-primary'>Donate</button>
        <button type='button' className='btn btn-link' onClick={onCancelClick}>Cancel</button>
      </Form>
    )
  }
}

export { DonateButton }
export default connect(null, { addPopTartMsg })(DonateButton)
