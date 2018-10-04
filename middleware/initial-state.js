import config from 'config'

export default (app) => {
  app.use((req, res, next) => {
    req.initialState = { config: config.public }
    next()
  })
}
