import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { hasRole } from '../lib/roles'
import {
  SET_JWT,
  SET_USER,
  REQUEST_USER_ERROR,
  RECEIVE_USER,
  RECEIVE_LOGIN,
  RECEIVE_UPDATE_USER
} from './actions/user'
import {
  SET_VIEW
} from './actions/view'
import {
  ADD_POPTART_MSG
} from './actions/popmsgs'
import {
  RECEIVE_NOTIFICATIONS,
  REQUEST_CONFIRM_NOTIFICATION,
  REQUEST_REJECT_NOTIFICATION,
  REQUEST_CONFIRM_NOTIFICATION_ERROR,
  REQUEST_REJECT_NOTIFICATION_ERROR
} from './actions/notifications'
import {
  REQUEST_LEAGUE_LEADERBOARD,
  RECEIVE_LEAGUE_LEADERBOARD
} from './actions/league-leaderboard'
import {
  REQUEST_COMPANY_LEADERBOARD,
  RECEIVE_COMPANY_LEADERBOARD
} from './actions/company-leaderboard'
import {
  REQUEST_COMPANY_LEAGUES_LEADERBOARD,
  RECEIVE_COMPANY_LEAGUES_LEADERBOARD
} from './actions/company-leagues-leaderboard'
import {
  REQUEST_LEAGUE,
  REQUEST_PUBLIC_LEAGUE,
  RECEIVE_LEAGUE,
  RECEIVE_JOIN_LEAGUE,
  RECEIVE_DELETE_LEAGUE
} from './actions/league'
import {
  REQUEST_LEAGUES,
  RECEIVE_LEAGUES
} from './actions/leagues'
import {
  RECEIVE_DELETE_COMPANY_LEAGUE
} from './actions/company-league'
import {
  REQUEST_COMPANY_LEAGUES,
  RECEIVE_COMPANY_LEAGUES
} from './actions/company-leagues'
import {
  REQUEST_TEAM_LEADERBOARD,
  RECEIVE_TEAM_LEADERBOARD
} from './actions/team-leaderboard'
import {
  REQUEST_TEAM,
  RECEIVE_TEAM,
  RECEIVE_UPDATE_TEAM,
  RECEIVE_SWITCH_TEAM
} from './actions/team'
import {
  REQUEST_COMPANIES,
  RECEIVE_COMPANIES,
  RECEIVE_DELETE_COMPANY
} from './actions/companies'
import {
  REQUEST_MODERATORS,
  RECEIVE_MODERATORS,
  RECEIVE_DELETE_MODERATOR
} from './actions/moderators'
import {
  REQUEST_STATS_ERROR,
  RECEIVE_STATS
} from './actions/stats'
import {
  REQUEST_GRAPH,
  REQUEST_GRAPH_ERROR,
  RECEIVE_GRAPH
} from './actions/graph'
import {
  REQUEST_COMPANY_STATS_ERROR,
  RECEIVE_COMPANY_STATS
} from './actions/company-stats'
import {
  REQUEST_ADMIN_USERS,
  RECEIVE_ADMIN_USERS
} from './actions/admin/users'
import {
  RECEIVE_ADMIN_UPDATE_USER,
  RECEIVE_ADMIN_DELETE_USER
} from './actions/admin/user'
import {
  RECEIVE_ADMIN_UPDATE_COMPANY
} from './actions/admin/company'
import {
  RECEIVE_DELETE_COMPANY_MEMBER
} from './actions/company-member'
import {
  REQUEST_COMPANY_MEMBERS,
  RECEIVE_COMPANY_MEMBERS,
  RECEIVE_CREATE_COMPANY_MEMBERS
} from './actions/company-members'
import {
  RECEIVE_COMPANY_TOKENS,
  RECEIVE_NEW_COMPANY_TOKEN,
  REQUEST_REVOKE_COMPANY_TOKEN,
  REQUEST_REVOKE_COMPANY_TOKEN_ERROR,
  RECEIVE_VALIDATE_COMPANY_TOKEN
} from './actions/company-tokens'
import {
  RECEIVE_CREATE_COMPANY_SHOP_ITEM,
  RECEIVE_UPDATE_COMPANY_SHOP_ITEM,
  RECEIVE_DELETE_COMPANY_SHOP_ITEM
} from './actions/company-shop-item'
import {
  RECEIVE_COMPANY_SHOP_ITEMS
} from './actions/company-shop-items'
import {
  RECEIVE_COMPANY_SHOP_ITEM_BUY
} from './actions/company-shop-item-buy'
import {
  RECEIVE_CREATE_COMPANY_CHARITY_BUCKET,
  RECEIVE_UPDATE_COMPANY_CHARITY_BUCKET,
  RECEIVE_DELETE_COMPANY_CHARITY_BUCKET
} from './actions/company-charity-bucket'
import {
  RECEIVE_COMPANY_CHARITY_BUCKETS
} from './actions/company-charity-buckets'
import {
  RECEIVE_COMPANY_CHARITY_BUCKET_DONATE
} from './actions/company-charity-bucket-donate'
import {
  RECEIVE_COMPANY_TRANSACTION_LOGS
} from './actions/company-transaction-logs'
import {
  RECEIVE_TRANSACTION_LOGS
} from './actions/transaction-logs'

function jwt (jwt = null, action) {
  switch (action.type) {
    case SET_JWT:
    case RECEIVE_LOGIN:
      return action.jwt
    default:
      return jwt
  }
}

function user (state = null, action) {
  switch (action.type) {
    case SET_USER:
    case RECEIVE_USER:
    case RECEIVE_LOGIN:
    case RECEIVE_UPDATE_USER:
    case RECEIVE_COMPANY_SHOP_ITEM_BUY:
    case RECEIVE_COMPANY_CHARITY_BUCKET_DONATE:
      return action.user
    case REQUEST_USER_ERROR:
      return null
    default:
      return state
  }
}

function view (state = 'user', action) {
  switch (action.type) {
    case SET_USER:
    case RECEIVE_USER:
    case RECEIVE_LOGIN:
      if (hasRole(action.user, 'admin')) return 'admin'
      if (hasRole(action.user, 'corporate_mod')) return 'corporate_mod'
      return 'user'
    case SET_VIEW:
      return action.view
    default:
      return state
  }
}

function notifications (state = [], action) {
  switch (action.type) {
    case RECEIVE_NOTIFICATIONS:
      return action.notifications
    case REQUEST_CONFIRM_NOTIFICATION:
    case REQUEST_REJECT_NOTIFICATION:
      return state.filter((n) => n._id !== action.notification._id)
    case REQUEST_CONFIRM_NOTIFICATION_ERROR:
    case REQUEST_REJECT_NOTIFICATION_ERROR:
      return state.concat(action.notification)
    default:
      return state
  }
}

function popMsg (state = [], action) {
  switch (action.type) {
    case ADD_POPTART_MSG:
      let newMsgStack = Array.from(state)
      newMsgStack.push(action.popMsg)
      return newMsgStack
    default:
      return state
  }
}

function leagueLeaderboard (state = null, action) {
  switch (action.type) {
    case REQUEST_LEAGUE_LEADERBOARD:
      return []
    case RECEIVE_LEAGUE_LEADERBOARD:
      return action.leaderboard
    default:
      return state
  }
}

function companyLeaderboard (state = null, action) {
  switch (action.type) {
    case REQUEST_COMPANY_LEADERBOARD:
      return []
    case RECEIVE_COMPANY_LEADERBOARD:
      return action.leaderboard
    default:
      return state
  }
}

function companyLeaguesLeaderboard (state = null, action) {
  switch (action.type) {
    case REQUEST_COMPANY_LEAGUES_LEADERBOARD:
      return []
    case RECEIVE_COMPANY_LEAGUES_LEADERBOARD:
      return action.leaderboard
    default:
      return state
  }
}

function league (state = null, action) {
  switch (action.type) {
    case REQUEST_LEAGUE:
      return null
    case REQUEST_PUBLIC_LEAGUE:
      return null
    case RECEIVE_LEAGUE:
      return action.league
    default:
      return state
  }
}

function leagues (state = [], action) {
  switch (action.type) {
    case REQUEST_LEAGUES:
      return []
    case RECEIVE_LEAGUES:
      return action.leagues
    case RECEIVE_JOIN_LEAGUE:
      return state.concat(action.league)
    case RECEIVE_DELETE_LEAGUE:
      return state.filter((l) => l._id !== action.leagueId)
    default:
      return state
  }
}

function companyLeagues (state = [], action) {
  switch (action.type) {
    case REQUEST_COMPANY_LEAGUES:
      return []
    case RECEIVE_COMPANY_LEAGUES:
      return action.leagues
    case RECEIVE_DELETE_COMPANY_LEAGUE:
      return state.filter((l) => l._id !== action.leagueId)
    default:
      return state
  }
}

function teamLeaderboard (state = null, action) {
  switch (action.type) {
    case REQUEST_TEAM_LEADERBOARD:
      return []
    case RECEIVE_TEAM_LEADERBOARD:
      return action.leaderboard
    default:
      return state
  }
}

function team (state = null, action) {
  switch (action.type) {
    case REQUEST_TEAM:
      return null
    case RECEIVE_TEAM:
    case RECEIVE_UPDATE_TEAM:
    case RECEIVE_SWITCH_TEAM:
      return action.team
    default:
      return state
  }
}

function companies (state = [], action) {
  switch (action.type) {
    case REQUEST_COMPANIES:
      return []
    case RECEIVE_COMPANIES:
      return action.companies
    case RECEIVE_DELETE_COMPANY:
      return state.filter((c) => c._id !== action.companyId)
    case RECEIVE_VALIDATE_COMPANY_TOKEN:
      return [action.company]
    case RECEIVE_ADMIN_UPDATE_COMPANY:
      return (state || []).map((c) => {
        return c._id === action.company._id ? action.company : c
      })
    default:
      return state
  }
}

function moderators (state = [], action) {
  switch (action.type) {
    case REQUEST_MODERATORS:
      return []
    case RECEIVE_MODERATORS:
      return action.moderators
    case RECEIVE_DELETE_MODERATOR:
      return state.filter((u) => u._id !== action.userId)
    default:
      return state
  }
}

function stats (state = null, action) {
  switch (action.type) {
    case RECEIVE_STATS:
      return action.stats
    case REQUEST_STATS_ERROR:
      return null
    default:
      return state
  }
}

function graph (state = null, action) {
  switch (action.type) {
    case RECEIVE_GRAPH:
      return action.graph
    case REQUEST_GRAPH:
    case REQUEST_GRAPH_ERROR:
      return null
    default:
      return state
  }
}

function companyStats (state = null, action) {
  switch (action.type) {
    case RECEIVE_COMPANY_STATS:
      return action.stats
    case REQUEST_COMPANY_STATS_ERROR:
      return null
    default:
      return state
  }
}

function adminUsers (state = [], action) {
  switch (action.type) {
    case REQUEST_ADMIN_USERS:
      return []
    case RECEIVE_ADMIN_USERS:
      return action.users
    case RECEIVE_ADMIN_UPDATE_USER:
      return (state || []).map((u) => {
        return u._id === action.user._id ? action.user : u
      })
    case RECEIVE_ADMIN_DELETE_USER:
      return (state || []).filter((u) => u._id !== action.userId)
    default:
      return state
  }
}

function companyMembers (state = [], action) {
  switch (action.type) {
    case REQUEST_COMPANY_MEMBERS:
      return []
    case RECEIVE_COMPANY_MEMBERS:
      return action.members
    case RECEIVE_DELETE_COMPANY_MEMBER:
      return (state || []).filter((u) => u._id !== action.userId)
    case RECEIVE_CREATE_COMPANY_MEMBERS:
      return (state || []).concat(action.members)
    default:
      return state
  }
}

function companyTokens (state = [], action) {
  switch (action.type) {
    case RECEIVE_COMPANY_TOKENS:
      return action.tokens
    case RECEIVE_NEW_COMPANY_TOKEN:
    case REQUEST_REVOKE_COMPANY_TOKEN_ERROR:
      return state.concat(action.token)
    case REQUEST_REVOKE_COMPANY_TOKEN:
      return state.filter((t) => t !== action.token)
    default:
      return state
  }
}

function companyShopItems (state = [], action) {
  switch (action.type) {
    case RECEIVE_COMPANY_SHOP_ITEMS:
      return action.items
    case RECEIVE_UPDATE_COMPANY_SHOP_ITEM:
    case RECEIVE_COMPANY_SHOP_ITEM_BUY:
      return state.map((item) => item._id === action.item._id ? action.item : item)
    case RECEIVE_CREATE_COMPANY_SHOP_ITEM:
      return [action.item].concat(state)
    case RECEIVE_DELETE_COMPANY_SHOP_ITEM:
      return state.filter((item) => item._id !== action.itemId)
    default:
      return state
  }
}

function companyCharityBuckets (state = [], action) {
  switch (action.type) {
    case RECEIVE_COMPANY_CHARITY_BUCKETS:
      return action.buckets
    case RECEIVE_UPDATE_COMPANY_CHARITY_BUCKET:
    case RECEIVE_COMPANY_CHARITY_BUCKET_DONATE:
      return state.map((bucket) => bucket._id === action.bucket._id ? action.bucket : bucket)
    case RECEIVE_CREATE_COMPANY_CHARITY_BUCKET:
      return [action.bucket].concat(state)
    case RECEIVE_DELETE_COMPANY_CHARITY_BUCKET:
      return state.filter((bucket) => bucket._id !== action.bucketId)
    default:
      return state
  }
}

function companyTransactionLogs (state = [], action) {
  switch (action.type) {
    case RECEIVE_COMPANY_TRANSACTION_LOGS:
      const newState = Array.from(state)
      const { skip, limit, logs } = action.data
      const minTotalLength = skip + limit
      newState.length = Math.max(newState.length, minTotalLength)
      newState.splice(skip, limit, ...logs)
      return newState
    default:
      return state
  }
}

function companyTransactionLogCount (state = 0, action) {
  switch (action.type) {
    case RECEIVE_COMPANY_TRANSACTION_LOGS:
      return action.data.total
    default:
      return state
  }
}

function transactionLogs (state = [], action) {
  switch (action.type) {
    case RECEIVE_TRANSACTION_LOGS:
      return state
        // Append
        .concat(action.logs)
        // Dedupe
        .reduce((logs, log) => (
          logs.some((l) => l._id === log._id) ? logs : logs.concat(log)
        ), [])
        // Sort
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return -1
          } else if (a.createdAt < b.createdAt) {
            return 1
          }
          return 0
        })
    default:
      return state
  }
}

function transactionLogsTotal (state = 0, action) {
  switch (action.type) {
    case RECEIVE_TRANSACTION_LOGS:
      return action.total
    default:
      return state
  }
}

export default combineReducers({
  config: (state = null) => state,
  jwt,
  user,
  view,
  notifications,
  popMsg,
  leagueLeaderboard,
  companyLeaderboard,
  companyLeaguesLeaderboard,
  league,
  leagues,
  teamLeaderboard,
  team,
  companies,
  moderators,
  stats,
  graph,
  companyStats,
  companyMembers,
  companyLeagues,
  companyShopItems,
  companyCharityBuckets,
  companyTransactionLogs,
  companyTransactionLogCount,
  adminUsers,
  companyTokens,
  transactionLogs,
  transactionLogsTotal,
  connect: (state = null) => state,
  routing: routerReducer
})
