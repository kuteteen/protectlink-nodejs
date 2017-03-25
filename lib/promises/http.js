'use strict'

const got = require('got')

exports.get = uri => {
  let opts = {
    json: true,
    timeouts: 3000,
    retries: 2
  }

  return got(uri, opts)
    .then(response => {
      return response.body
    })
    .catch(error => {
      return error
    })
}
