import test from 'tape'
import config from 'config'
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import Sinon from 'sinon'
import {
  REQUEST_REGISTER,
  REQUEST_REGISTER_ERROR,
  RECEIVE_REGISTER,
  requestRegister
} from '../redux/actions/user'
import fakeUser from './helpers/fake-user'
import fakeRegisterPayload from './helpers/fake-register-payload'
import Auth0 from '../lib/auth0'

const mockStore = configureStore([thunkMiddleware])

test('Should register successfully', (t) => {
  t.plan(6)

  const payload = fakeUser()

  const initialState = { config: config.public }
  const store = mockStore(initialState)
  const auth0 = {
    signup: Sinon.stub().callsArg(1),
    login: Sinon.stub()
  }

  Sinon.stub(Auth0, 'get', () => auth0)

  store.dispatch(requestRegister(fakeRegisterPayload(payload)))
    .then(() => {
      const actions = store.getActions()

      t.equal(actions[0].type, REQUEST_REGISTER, 'Register was requested')
      t.ok(auth0.signup.called, 'Auth0 signup was called')
      t.equal(actions[1].type, RECEIVE_REGISTER, 'Register was received')
      t.ok(actions[1].memo.id, 'Memo has ID')
      t.equal(actions[1].memo.data.firstName, payload.firstName, 'Memo user was correct')
      t.ok(auth0.login.called, 'Auth0 login was called')

      Auth0.get.restore()
      t.end()
    })
    .catch((err) => {
      t.ifError(err, 'Unexpected error')
      Auth0.get.restore()
      t.end()
    })
})

test('Should not register when Auth0 signup error', (t) => {
  t.plan(4)

  const initialState = { config: config.public }
  const store = mockStore(initialState)

  const auth0 = {
    signup: Sinon.stub().callsArgWith(1, new Error('Field email is required'))
  }

  Sinon.stub(Auth0, 'get', () => auth0)

  store.dispatch(requestRegister({}))
    .then(() => {
      t.ok(false, 'Unexpected success')
      Auth0.get.restore()
      t.end()
    })
    .catch((err) => {
      t.ok(err, 'Expected err')

      const actions = store.getActions()

      t.equal(actions[0].type, REQUEST_REGISTER, 'Register was requested')
      t.equal(actions[1].type, REQUEST_REGISTER_ERROR, 'Register error received')
      t.equal(actions[1].err.message, 'Field email is required', 'Error message was correct')

      Auth0.get.restore()
      t.end()
    })
})
