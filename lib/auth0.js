import Auth0 from 'auth0-js'

let auth0

export default {
  get (config) {
    if (!auth0) {
      auth0 = new Auth0.WebAuth({
        domain: config.domain,
        clientID: config.clientId,
        redirectUri: config.redirectUri,
        responseType: 'token id_token'
      })
    }
    return auth0
  }
}
