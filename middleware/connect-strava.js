import passport from 'passport'
import { Strategy as StravaStrategy } from 'passport-strava'
import config from 'config'
import assignNonEmpty from '../lib/assign-non-empty'

export default (app) => {
  passport.use(new StravaStrategy({
    clientID: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
    callbackURL: config.strava.callbackUrl,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    // Store the tokens in the request so we can add them to the store later
    req.initialState.connect = { strava: { accessToken } }

    if (refreshToken) {
      req.initialState.connect.strava.refreshToken = refreshToken
    }

    // Normalise the Strava profile
    if (profile) {
      req.initialState.connect.strava.profile = assignNonEmpty({
        id: { key: 'id', val: (v) => v.toString() },
        profile: { key: 'avatar', val: (v) => v.slice(0, 4) === 'http' ? v : null },
        email: 'email',
        sex: { key: 'gender', val: (v) => ({ M: 'Male', F: 'Female' })[v] },
        city: 'city',
        state: 'state',
        country: 'country',
        weight: 'weight'
      }, profile._json)
    }

    done(null, true)
  }))

  app.get('/connect/strava', passport.authenticate('strava'))
  app.get('/connect/strava/callback', (req, res, next) => {
    passport.authenticate('strava', (err) => next(err))(req, res, next)
  })
}
