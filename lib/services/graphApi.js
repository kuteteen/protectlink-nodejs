'use strict'

const qs = require('querystring')
const got = require('got')
const log = require('fancy-log')

const BASE_GRAPH_URI = `https://graph.facebook.com/${process.env.API_VERSION}/`

exports.consume = (token, node, opts = {}) => {
  opts = Object.assign(opts, { access_token: token })

  let query = qs.stringify(opts)
  let consumeUri = BASE_GRAPH_URI + `${node}?${query}`

  log.info(`consume: ${consumeUri}`)

  return new Promise(resolve => {
    _request(consumeUri)
      .then(result => resolve(result))
      .catch(err => {
        log.error(err)
        resolve([])
      })
  })
}

let _request = uri => {
  let opts = {
    json: true,
    timeout: 9000,
    retries: 0
  }

  return got(uri, opts)
    .then(response => {
      return response.body
    })
    .catch(error => {
      log.error(error.response.body)
    })
}
