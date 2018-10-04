import passport from 'passport'
import { Strategy as RunkeeperStrategy } from 'passport-runkeeper'
import config from 'config'
import fetch from 'isomorphic-fetch'
import moment from 'moment'
import merge from 'lodash.merge'

export default (app) => {
  passport.use(new RunkeeperStrategy({
    clientID: config.runkeeper.clientId,
    clientSecret: config.runkeeper.clientSecret,
    callbackURL: config.runkeeper.callbackUrl,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    // Store the tokens in the request so we can add them to the store later
    req.initialState.connect = { runkeeper: { accessToken } }

    if (refreshToken) {
      req.initialState.connect.runkeeper.refreshToken = refreshToken
    }
    if (profile) {
      req.initialState.connect.runkeeper.profile = {
        id: profile.id.toString()
      }
    }

    const url = 'http://api.runkeeper.com'
    const opts = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const promiseMaker = ({ route, accept }) => {
      return fetch(`${url}/${route}`, merge({ headers: { Accept: accept } }, opts))
        .then((res) => res.json())
        .catch((err) => {
          console.log(`Could not get ${route} data from Runkeeper`, err)
          return Promise.resolve({})
        })
    }

    const profilePromise = promiseMaker({ route: 'profile', accept: 'application/vnd.com.runkeeper.Profile+json' })
    const weightPromise = promiseMaker({ route: 'weight', accept: 'application/vnd.com.runkeeper.WeightSetFeed+json' })

    Promise.all([ profilePromise, weightPromise ])
      .then((jsonArray) => {
        const profile = jsonArray[0]
        const weightObj = (jsonArray[1].items && jsonArray[1].items.length && jsonArray[1].items[0]) || {}
        if (profile.gender) {
          let gender = ({ M: 'Male', F: 'Female' })[profile.gender] || 'Other'
          req.initialState.connect.runkeeper.profile.gender = gender
        }
        if (profile.birthday) {
          req.initialState.connect.runkeeper.profile.dob = moment(profile.birthday, 'ddd, DD MMM YYYY, HH:mm:ss').toDate()
        }
        if (weightObj.weight) {
          req.initialState.connect.runkeeper.profile.weight = weightObj.weight
        }
        done(null, true)
      }).catch((err) => {
        console.log('Error in Promise handler', err)
        done(null, true)
      })
  }))

  app.get('/connect/runkeeper', passport.authenticate('runkeeper'))
  app.get('/connect/runkeeper/callback', (req, res, next) => {
    passport.authenticate('runkeeper', (err) => next(err))(req, res, next)
  })
}
