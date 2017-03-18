'use strict'

const qs = require('querystring')
const got = require('got')

const BASE_EXCHANGE_URI = `https://graph.facebook.com/${process.env.API_VERSION}/oauth/access_token?`

const BASE_INVOKE_URI = `https://www.facebook.com/${process.env.API_VERSION}/dialog/oauth?`

exports.createInvokeUri = callbackUri => {
  let query = qs.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: callbackUri,
    scope: 'public_profile'
  })

  return BASE_INVOKE_URI + query
}

exports.callback = (callbackUri, code) => {
  let query = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: callbackUri,
    code: code
  })
  let exchangeUri = BASE_EXCHANGE_URI + query

  return new Promise(resolve => {
    _exchange(exchangeUri)
      .then(result => resolve(result))
      .catch(err => {
        console.log(err)
        resolve([])
      })
  })
}

let _exchange = uri => {
  let opts = {
    json: true,
    timeouts: 9000,
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
