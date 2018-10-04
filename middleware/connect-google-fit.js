import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import config from 'config'
import moment from 'moment'
import assignNonEmpty from '../lib/assign-non-empty'
import google from 'googleapis'
import map from 'async/map'
import round from 'lodash.round'

export default (app) => {
  passport.use(new GoogleStrategy({
    clientID: config['google-fit'].clientId,
    clientSecret: config['google-fit'].clientSecret,
    callbackURL: config['google-fit'].callbackUrl,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    // Store the tokens in the request so we can add them to the store later
    req.initialState.connect = { 'google-fit': { accessToken } }

    if (refreshToken) {
      req.initialState.connect['google-fit'].refreshToken = refreshToken
    }

    const OAuth2 = google.auth.OAuth2
    const oauth2Client = new OAuth2(config['google-fit'].clientId, config['google-fit'].clientSecret, config['google-fit'].callbackURL)
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    const googleFit = google.fitness({ version: 'v1', auth: oauth2Client })
    const now = Date.now()
    const dateString = `${now - (1000 * 60 * 60 * 24 * 365 * 5)}000000-${now}000000`

    map([
      'derived:com.google.height:com.google.android.gms:merge_height',
      'derived:com.google.weight:com.google.android.gms:merge_weight'
    ], (dataSourceId, cb) => {
      googleFit.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId,
        datasetId: dateString
      }, cb)
    }, (err, res) => {
      if (err) {
        console.error('Couldn\'t get Google Fit stats', err)
        res = [{}, {}]
      }

      // Normalise the Google Fit profile
      if (profile) {
        req.initialState.connect['google-fit'].profile = assignNonEmpty({
          gender: { key: 'gender', val: (v) => ({ male: 'Male', female: 'Female' })[v] },
          birthday: { key: 'dob', val: (v) => {
            const date = v && moment(v, 'YYYY-MM-DD')
            return (date && date.year()) ? date : null
          }},
          image: { key: 'avatar', val: (v) => v && v.url },
          placesLived: { key: 'city', val: (v) => v && v.length && v[0].value }
        }, profile._json || {})
        req.initialState.connect['google-fit'].profile.id = profile.id
      }
      if (res[0].point && res[0].point.length) {
        req.initialState.connect['google-fit'].profile.height = round(res[0].point.slice(-1)[0].value[0].fpVal * 100, 1)
      }
      if (res[1].point && res[1].point.length) {
        req.initialState.connect['google-fit'].profile.weight = round(res[1].point.slice(-1)[0].value[0].fpVal, 1)
      }

      done(null, true)
    })
  }))

  app.get('/connect/google-fit', passport.authenticate('google', {
    scope: [
      'profile',
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read'
    ],
    accessType: 'offline'
  }))
  app.get('/connect/google-fit/callback', (req, res, next) => {
    passport.authenticate('google', (err) => next(err))(req, res, next)
  })
}
