import test from 'tape'
import config from 'config'
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import Sinon from 'sinon'
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_ERROR,
  RECEIVE_LOGIN,
  requestLogin
} from '../redux/actions/user'
import startServer from './helpers/mock-json-server'
import fakeUser from './helpers/fake-user'
import Auth0 from '../lib/auth0'

const mockStore = configureStore([thunkMiddleware])

test('Should login successfully', (t) => {
  t.plan(7)

  const payload = fakeUser()
  const jwt = 'FAKE_JWT'

  startServer(payload, { headers: { Authorization: jwt } }, (err, server) => {
    t.ifError(err, 'No error starting mock json server')

    const initialState = { config: config.public }
    const store = mockStore(initialState)

    const auth0 = {
      login: Sinon.stub().callsArgWith(1, null, { idToken: jwt })
    }

    Sinon.stub(Auth0, 'get', () => auth0)

    store.dispatch(requestLogin({ email: 'test@example.org', password: 'letmein' }))
      .then(() => {
        const actions = store.getActions()

        t.equal(actions[0].type, REQUEST_LOGIN, 'Login was requested')
        t.ok(auth0.login.called, 'Auth0 login was called')
        t.equal(actions[1].type, RECEIVE_LOGIN, 'Login was received')
        t.equal(actions[1].user.firstName, payload.firstName, 'User was correct')
        t.equal(actions[1].jwt, jwt, 'JWT was correct')

        Auth0.get.restore()

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
      .catch((err) => {
        t.ifError(err, 'Unexpected error')

        Auth0.get.restore()

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
  })
})

test('Should not login when Auth0 login error', (t) => {
  t.plan(4)

  const initialState = { config: config.public }
  const store = mockStore(initialState)

  const auth0 = {
    login: Sinon.stub().callsArgWith(1, new Error('Unauthorized'))
  }

  Sinon.stub(Auth0, 'get', () => auth0)

  store.dispatch(requestLogin({ email: 'test@example.org', password: 'letmein' }))
    .then(() => {
      t.ok(false, 'Unexpected success')
      Auth0.get.restore()
      t.end()
    })
    .catch((err) => {
      t.ok(err, 'Expected err')

      const actions = store.getActions()

      t.equal(actions[0].type, REQUEST_LOGIN, 'Login was requested')
      t.equal(actions[1].type, REQUEST_LOGIN_ERROR, 'Login error received')
      t.equal(actions[1].err.message, 'Unauthorized', 'Error message was correct')

      Auth0.get.restore()

      t.end()
    })
})
