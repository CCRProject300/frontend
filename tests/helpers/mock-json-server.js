import Http from 'http'

// Create a server that responds with the passed payload as an application/json Content-Type
export default (payload, opts, cb) => {
  if (!cb) {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  opts.port = opts.port || 4040
  opts.statusCode = opts.statusCode || 200
  opts.headers = Object.assign({'Content-Type': 'application/json'}, opts.headers || {})

  const server = Http.createServer((req, res) => {
    res.statusCode = opts.statusCode
    Object.keys(opts.headers).forEach((k) => res.setHeader(k, opts.headers[k]))
    res.write(JSON.stringify(payload))
    res.end()
  }).listen(opts.port, (err) => cb(err, server))
}
