import React from 'react'
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { useScroll } from 'react-router-scroll'
import * as pages from './ui/pages'
import Layout from './ui/layouts/layout.jsx'
import LoggedInLayout from './ui/layouts/logged-in-layout.jsx'
import LoggedInLayoutBasic from './ui/layouts/logged-in-layout-basic.jsx'
import OnboardedLayout from './ui/layouts/onboarded-layout.jsx'

const routes = (props = {}) => {
  const history = props.store ? syncHistoryWithStore(browserHistory, props.store) : browserHistory

  return (
    <Router history={history} render={applyRouterMiddleware(useScroll())}>
      <Route path='/' component={Layout}>
        <IndexRoute component={pages.Home} />
        <Route path='signup' component={pages.Home} initialTab='signup' />
        <Route path='login' component={pages.Home} initialTab='login' />
        <Route path='admin' component={LoggedInLayout}>
          <Route path='users' component={pages.AdminUsers} />
          <Route path='leagues' component={pages.AdminPublicLeagues} />
          <Route path='league/add' component={pages.AdminPublicLeagueAdd} />
          <Route path='companies' component={pages.AdminCompanies} />
          <Route path='company/add' component={pages.AdminCompanyAdd} />
          <Route path='company/:companyId' component={pages.AdminCompanyUpdate} />
          <Route path='company/:companyId/moderators' component={pages.AdminCompanyModerators} />
          <Route path='company/:companyId/moderators/add' component={pages.AdminCompanyModeratorsAdd} />
        </Route>
        <Route path='company' component={OnboardedLayout}>
          <Route path=':companyId/members' component={pages.CompanyMembers} />
          <Route path=':companyId/members/add' component={pages.CompanyMembersAdd} />
          <Route path=':companyId/leagues' component={pages.CompanyLeagues} />
          <Route path=':companyId/league/add' component={pages.CompanyLeagueAdd} />
          <Route path=':companyId/rewards' component={pages.CompanyRewards} />
          <Route path=':companyId/shop/item/add' component={pages.CompanyShopItemAdd} />
          <Route path=':companyId/shop/item/:itemId' component={pages.CompanyShopItemUpdate} />
          <Route path=':companyId/charity/bucket/add' component={pages.CompanyCharityBucketAdd} />
          <Route path=':companyId/charity/bucket/:bucketId' component={pages.CompanyCharityBucketUpdate} />
          <Route path=':companyId/transaction-logs' component={pages.CompanyTransactionLogs} />
        </Route>
        <Route path='rewards' component={OnboardedLayout}>
          <IndexRoute component={pages.Rewards} />
        </Route>
        <Route path='charity/:bucketId' component={OnboardedLayout}>
          <IndexRoute component={pages.CharityBucket} />
        </Route>
        <Route path='transaction-logs' component={OnboardedLayout}>
          <IndexRoute component={pages.TransactionLogs} />
        </Route>
        <Route path='leagues' component={OnboardedLayout}>
          <IndexRoute component={pages.Leagues} />
        </Route>
        <Route path='league' component={OnboardedLayout}>
          <Route path='add' component={pages.LeagueAdd} />
          <Route path=':leagueId/leaderboard' component={pages.LeagueLeaderboard} />
          <Route path=':leagueId/members/add' component={pages.LeagueMembersAdd} />
        </Route>
        <Route path='league/:leagueId' component={pages.LeagueLandingPage} />
        <Route path='team' component={OnboardedLayout}>
          <Route path=':teamId/leaderboard' component={pages.TeamLeaderboard} />
        </Route>
        <Route path='profile' component={OnboardedLayout}>
          <IndexRoute component={pages.Dashboard} />
        </Route>
        <Route path='connect' component={LoggedInLayoutBasic}>
          <Route path='fitbit/callback' component={pages.FitbitCallback} />
          <Route path='google-fit/callback' component={pages.GoogleFitCallback} />
          <Route path='runkeeper/callback' component={pages.RunkeeperCallback} />
          <Route path='strava/callback' component={pages.StravaCallback} />
        </Route>
        <Route path='connected' component={OnboardedLayout}>
          <Route path='fitbit' component={pages.ConnectedFitbit} />
          <Route path='google-fit' component={pages.ConnectedGoogleFit} />
          <Route path='strava' component={pages.ConnectedStrava} />
          <Route path='runkeeper' component={pages.ConnectedRunkeeper} />
        </Route>
        <Route path='getting-started' component={LoggedInLayout}>
          <IndexRoute component={pages.GettingStarted} />
        </Route>
        <Route path='faq' component={LoggedInLayout}>
          <IndexRoute component={pages.Faqs} />
        </Route>
        <Route path='settings' component={OnboardedLayout}>
          <IndexRoute component={pages.Settings} />
        </Route>
        <Route path='auth0/callback' component={pages.Auth0Callback} />
        <Route path='*' component={pages.Error404} />
      </Route>
    </Router>
  )
}

export default routes
