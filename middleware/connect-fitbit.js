import passport from 'passport'
import { FitbitOAuth2Strategy as FitbitStrategy } from 'passport-fitbit-oauth2'
import config from 'config'
import moment from 'moment'
import Boom from 'boom'
import assignNonEmpty from '../lib/assign-non-empty'
import jwtDecode from 'jwt-decode'

const SCOPES = ['activity', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight', 'heartrate']

export default (app) => {
  passport.use(new FitbitStrategy({
    clientID: config.fitbit.clientId,
    clientSecret: config.fitbit.clientSecret,
    callbackURL: config.fitbit.callbackUrl,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    let decoded

    try {
      decoded = jwtDecode(accessToken)
    } catch (err) {
      return done(Boom.wrap(err, 500, 'Invalid fitbit access token'))
    }

    const grantedScopes = (decoded.scopes || '').split(' ')

    if (grantedScopes.length !== SCOPES.length) {
      return done(Boom.create(400, 'To connect with Fitbit, KudosHealth requires ALL permissions to be authorised'))
    }

    // Store the tokens in the request so we can add them to the store later
    req.initialState.connect = { fitbit: { accessToken } }

    if (refreshToken) {
      req.initialState.connect.fitbit.refreshToken = refreshToken
    }

    // Normalise the Fitbit profile
    if (profile) {
      req.initialState.connect.fitbit.profile = assignNonEmpty({
        avatar: 'avatar',
        gender: { key: 'gender', val: (v) => ({ MALE: 'Male', FEMALE: 'Female' })[v] },
        dateOfBirth: { key: 'dob', val: (v) => v ? moment.utc(v).toDate() : v },
        city: 'city',
        state: 'state',
        country: 'country',
        weight: 'weight',
        height: 'height'
      }, (profile._json || {}).user)

      req.initialState.connect.fitbit.profile.id = profile.id
    }

    done(null, true)
  }))

  app.get('/connect/fitbit', passport.authenticate('fitbit', { scope: SCOPES }))

  app.get('/connect/fitbit/callback', (req, res, next) => {
    passport.authenticate('fitbit', (err) => next(err))(req, res, next)
  })
}
