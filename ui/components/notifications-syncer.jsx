import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { requestNotifications } from '../../redux/actions/notifications'

const NotificationsSyncer = function ({ requestNotifications }) {
  requestNotifications()
  return null
}

const mapStateToProps = ({ routing }) => ({ routing })
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ requestNotifications }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsSyncer)
