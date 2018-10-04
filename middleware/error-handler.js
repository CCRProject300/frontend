import Boom from 'boom'

export default (app, renderHtml) => {
  app.use((err, req, res, next) => {
    console.error(err)

    if (err.stack) {
      console.error(err.stack)
    }

    err = Boom.wrap(err)
    res.status(err.output.statusCode)

    if (req.accepts('html')) {
      return res.send(renderHtml(err.output.payload))
    }

    if (req.accepts('json')) {
      return res.json(err.output.payload)
    }

    res.type('txt').send(err.output.payload.message)
  })
}
