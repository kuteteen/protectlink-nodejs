'use strict'

const got = require('got')

let redirectUri = 'http://localhost:' + process.env.PORT + '/login/facebook/auth'

let profileUri = 'http://localhost:' + process.env.PORT + '/user/profile'

let exchangeBaseUri = 'https://graph.facebook.com/' + process.env.API_VERSION + '/oauth/access_token?' +
  'client_id=' + process.env.CLIENT_ID +
  '&redirect_uri=' + redirectUri +
  '&client_secret=' + process.env.CLIENT_SECRET +
  '&code='

let invokeUri = 'https://www.facebook.com/' + process.env.API_VERSION + '/dialog/oauth?' +
  'client_id=' + process.env.CLIENT_ID +
  '&redirect_uri=' + redirectUri +
  '&scope=public_profile'

exports.invokeUri = invokeUri

exports.profileUri = profileUri

exports.callback = code => {
  let exchangeUri = exchangeBaseUri + code

  return new Promise(resolve => {
    _exchange(exchangeUri)
      .then(result => resolve(result))
      .catch(error => {
        console.log(error)
        resolve([])
      })
  })
}

let _exchange = (uri) => {
  let opts = {
    json: true,
    timeout: 3000,
    retries: 0
  }

  return got(uri, opts)
    .then(response => {
      return response.body
    })
    .catch(error => {
      console.log(error.response.body)
    })
}
