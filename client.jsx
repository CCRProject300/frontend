import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Routes from './routes.jsx'
import Head from './ui/components/head.jsx'
import reducers from './redux/reducers'

const initialState = window.__REDUX_STATE__
const jwt = window.localStorage.getItem('jwt')
const user = window.localStorage.getItem('user')
if (jwt) initialState.jwt = jwt
if (user) initialState.user = JSON.parse(user)

let store = createStore(reducers, initialState, compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ))
syncHistoryWithStore(browserHistory, store)

render((
  <div>
    <Head {...initialState.config} />
    <Provider store={store}>
      <Routes store={store} />
    </Provider>
  </div>
), document.getElementById('root'))
