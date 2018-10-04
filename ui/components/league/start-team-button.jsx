import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Modal } from 'react-bootstrap'
import { addPopTartMsg } from '../../../redux/actions/popmsgs'
import { requestSwitchTeam } from '../../../redux/actions/team'

const StartNewTeamButton = React.createClass({
  propTypes: {
    league: PropTypes.object.isRequired,
    requestSwitchTeam: PropTypes.func.isRequired,
    addPopTartMsg: PropTypes.func.isRequired
  },

  getInitialState  () {
    return { modalShown: false }
  },

  hideModal () {
    this.setState({ modalShown: false })
  },

  createNewTeamPreamble () {
    if (!window.confirm('Are you sure you want to start a new team? You will lose all the points you\'ve accrued in the league so far')) return

    const { league } = this.props

    if (league.panels.length === 1) {
      this.createNewTeam(league.panels[0]._id)
    } else {
      this.setState({ modalShown: true })
    }
  },

  createNewTeam (panelId) {
    const { requestSwitchTeam, addPopTartMsg, league } = this.props

    requestSwitchTeam(league._id, { panelId })
      .then((team) => {
        this.hideModal()
        addPopTartMsg({ message: 'You have started a new team', level: 'success' })
        browserHistory.push(`/team/${team._id}/leaderboard`)
      })
      .catch((err) => {
        this.hideModal()
        addPopTartMsg({ message: err.message, level: 'error' })
      })
  },

  render () {
    const { league } = this.props

    if (!league.member) return null
    if (league.teamSize === 1) return null
    if (league.leagueType === 'public') return null

    return (
      <div>
        <button className='btn btn-info' onClick={this.createNewTeamPreamble}>
          Start new team
        </button>
        {this.renderPanelModal()}
      </div>
    )
  },

  renderPanelModal () {
    const { modalShown } = this.state
    const { league } = this.props

    return (
      <Modal show={modalShown} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>To start a new team, please select which group you'd like to be in:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {league ? league.panels.map((p) => {
            return (
              <span
                className='h2 label label-tag label-info'
                key={p._id}
                style={{ fontSize: '18px' }}
                onClick={this.createNewTeam.bind(this, p._id)}>
                {p.name}
              </span>
            )
          }) : null}
        </Modal.Body>
      </Modal>
    )
  }
})

const mapDispatchToProps = { addPopTartMsg, requestSwitchTeam }

export default connect(null, mapDispatchToProps)(StartNewTeamButton)
