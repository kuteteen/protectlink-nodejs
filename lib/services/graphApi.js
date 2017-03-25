'use strict'

const qs = require('querystring')
const log = require('fancy-log')
const {http} = require('../promise')

// const BASE_GRAPH_URI = `https://graph.facebook.com/${process.env.API_VERSION}/`
const BASE_GRAPH_URI = `http://localhost:12345/${process.env.API_VERSION}/`

exports.consume = (token, node, opts = {}) => {
  opts = Object.assign(opts, { access_token: token })

  let query = qs.stringify(opts)
  let consumeUri = BASE_GRAPH_URI + `${node}?${query}`

  log.info(`consume: ${consumeUri}`)

  return new Promise((resolve, reject) => {
    http.get(consumeUri)
      .then(result => {
        log.info('consume done')
        resolve(result)
      })
      .catch(err => {
        log.error('consume error')
        reject(err)
      })
  })
}
