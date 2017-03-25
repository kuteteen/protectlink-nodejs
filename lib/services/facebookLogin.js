'use strict'

const qs = require('querystring')
const log = require('fancy-log')
const {http} = require('../promise')

const BASE_EXCHANGE_URI = `https://graph.facebook.com/${process.env.API_VERSION}/oauth/access_token?`

const BASE_INVOKE_URI = `https://www.facebook.com/${process.env.API_VERSION}/dialog/oauth?`

exports.createInvokeUri = callbackUri => {
  let query = qs.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: callbackUri,
    scope: 'public_profile'
  })

  let invokeUri = BASE_INVOKE_URI + query

  log.info(`invoke: ${invokeUri}`)

  return invokeUri
}

exports.callback = (callbackUri, code) => {
  let query = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: callbackUri,
    code: code
  })
  let exchangeUri = BASE_EXCHANGE_URI + query

  log.info(`exchange: ${exchangeUri}`)

  return new Promise(resolve => {
    http.get(exchangeUri)
      .then(result => {
        log.info('exchange done')
        resolve(result)
      })
      .catch(err => {
        log.error(err)
        resolve([])
      })
  })
}
