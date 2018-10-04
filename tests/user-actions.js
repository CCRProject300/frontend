import test from 'tape'
import config from 'config'
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import {
  REQUEST_USER,
  REQUEST_USER_ERROR,
  RECEIVE_USER,
  requestUser
} from '../redux/actions/user'
import startServer from './helpers/mock-json-server'
import fakeUser from './helpers/fake-user'

const mockStore = configureStore([thunkMiddleware])

test('Should fetch user successfully', (t) => {
  t.plan(5)

  const payload = fakeUser()

  startServer(payload, (err, server) => {
    t.ifError(err, 'No error starting mock json server')

    const initialState = { config: config.public }
    const store = mockStore(initialState)

    store.dispatch(requestUser('FAKE_JWT'))
      .then(() => {
        const actions = store.getActions()

        t.equal(actions[0].type, REQUEST_USER, 'User was requested')
        t.equal(actions[1].type, RECEIVE_USER, 'User was received')
        t.equal(actions[1].user.firstName, payload.firstName, 'User was correct')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
      .catch((err) => {
        t.ifError(err, 'Unexpected error')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
  })
})

test('Should not fetch user when unauthorized', (t) => {
  t.plan(5)

  const payload = {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Invalid token format'
  }

  startServer(payload, { statusCode: payload.statusCode }, (err, server) => {
    t.ifError(err, 'No error starting mock json server')

    const initialState = { config: config.public }
    const store = mockStore(initialState)

    store.dispatch(requestUser('FAKE_JWT'))
      .then(() => {
        const actions = store.getActions()

        t.equal(actions[0].type, REQUEST_USER, 'User was requested')
        t.equal(actions[1].type, REQUEST_USER_ERROR, 'User error received')
        t.equal(actions[1].err.message, payload.message, 'Error message was correct')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
      .catch((err) => {
        t.ifError(err, 'Unexpected error')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
  })
})

test('Should not fetch user when server error', (t) => {
  t.plan(5)

  const payload = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Sprocket stuck in the flange'
  }

  startServer(payload, { statusCode: payload.statusCode }, (err, server) => {
    t.ifError(err, 'No error starting mock json server')

    const initialState = { config: config.public }
    const store = mockStore(initialState)

    store.dispatch(requestUser('FAKE_JWT'))
      .then(() => {
        const actions = store.getActions()

        t.equal(actions[0].type, REQUEST_USER, 'User was requested')
        t.equal(actions[1].type, REQUEST_USER_ERROR, 'User error received')
        t.equal(actions[1].err.message, payload.message, 'Error message was correct')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
      .catch((err) => {
        t.ifError(err, 'Unexpected error')

        server.close((err) => {
          t.ifError(err, 'No error stopping mock json server')
          t.end()
        })
      })
  })
})

test('Should not fetch user when server unreachable', (t) => {
  t.plan(3)

  const initialState = { config: config.public }
  const store = mockStore(initialState)

  store.dispatch(requestUser('FAKE_JWT'))
    .then(() => {
      const actions = store.getActions()

      t.equal(actions[0].type, REQUEST_USER, 'User was requested')
      t.equal(actions[1].type, REQUEST_USER_ERROR, 'User error received')
      t.ok(actions[1].err.message, 'Error message was received')

      t.end()
    })
    .catch((err) => {
      t.ifError(err, 'Unexpected error')
      t.end()
    })
})
