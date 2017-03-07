'use strict'

const got = require('got')

let redirectUri = 'http://localhost:' + process.env.PORT + '/login/facebook/redirect'

let OAuthUri = 'https://www.facebook.com/' + process.env.API_VERSION + '/dialog/oauth?' +
  'client_id=' + process.env.CLIENT_ID +
  '&redirect_uri=' + redirectUri +
  '&scope=public_profile'

let exchangeUri = 'https://graph.facebook.com/' + process.env.API_VERSION + '/oauth/access_token?' +
  'client_id=' + process.env.CLIENT_ID +
  '&redirect_uri=' + redirectUri +
  '&client_secret=' + process.env.CLIENT_SECRET +
  '&code='

let authenticatedUri = 'http://localhost:' + process.env.PORT + '/user/profile'

exports.facebook = (req, res) => {
  res.setHeader('Location', OAuthUri)
  res.statusCode = 302
  res.end()
}

exports.facebookRedirect = (req, res) => {
  let opts = {
    json: true,
    timeout: 3000,
    retries: 0
  }

  got(exchangeUri + req.query.code, opts)
    .then(resp => {
      req.session.authenticated = true
      req.session.access_token = resp.body.access_token
      req.session.token_type = resp.body.token_type
      req.session.expires_in = resp.body.expires_in
      console.log(req.session)
    })
    .then(
      res.setHeader('Location', authenticatedUri)
      res.statusCode = 302
      res.end()
    )
    .catch(err => {
      console.log(err.response.body)
    })
}
