'use strict'

const qs = require('querystring')
const got = require('got')

let graphBaseUri = 'https://graph.facebook.com/' + process.env.API_VERSION + '/'

exports.request = (node, opts, token) => {
  opts = Object.assign(opts, { access_token: token })

  let query = qs.stringify(opts)
  let graphUri = graphBaseUri + node + '?' + query

  return new Promise(resolve => {
    _request(graphUri)
      .then(result => resolve(result))
      .catch(err => {
        console.log(err)
        resolve([])
      })
  })
}

let _request = (uri) => {
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
