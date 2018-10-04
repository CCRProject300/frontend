import React from 'react'
import express from 'express'
import { RouterContext, match } from 'react-router'
import { renderToString } from 'react-dom/server'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
import config from 'config'
import morgan from 'morgan'
import passport from 'passport'
import compress from 'compression'
import Head from './ui/components/head.jsx'
import ErrorPage from './ui/pages/error.jsx'
import routes from './routes.jsx'
import pageContent, { staticPageContent } from './page-content'
import reducers from './redux/reducers'
import middleware from './middleware'

const app = express()
console.log(`Config file: ${config}`)

app.use(compress())
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(passport.initialize())

middleware.initialState(app)
middleware.connectFitbit(app)
middleware.connectGoogleFit(app)
middleware.connectRunkeeper(app)
middleware.connectStrava(app)

app.get('*', (req, res, next) => {
  match({ routes: routes(), location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) return next(err)

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    }

    if (!renderProps) {
      return res.status(404).send('Not found')
    }

    const components = renderProps.components

    if (components.some((c) => c && c.displayName === 'error404')) {
      res.status(404)
    }

    const initialState = req.initialState || {}
    const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware))
    const { location, params, history } = renderProps

    Promise
      .all(
        components
          .filter((c) => c && c.fetchData)
          .map((c) => c.fetchData({ store, location, params, history }))
      )
      .then(() => {
        const reduxState = JSON.stringify(store.getState())
        const html = renderToString(
          <div>
            <Head {...initialState.config} />
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          </div>
        )
        const head = Helmet.rewind()
        const context = {
          html,
          reduxState,
          head
        }
        const doc = pageContent(context)

        res.send(doc)
      })
      .catch((err) => next(err))
  })
})

middleware.errorHandler(app, (props) => {
  const html = renderToString(
    <div>
      <Head {...config.public} />
      <ErrorPage {...props} />
    </div>
  )
  const head = Helmet.rewind()
  return staticPageContent({ html, head })
})

const server = app.listen(config.port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server running at: http://${host}:${port} env: ${process.env.NODE_ENV}`)
})
