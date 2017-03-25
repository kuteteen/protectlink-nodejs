'use strict'

const Promise = require('bluebird')

const _promiseWhile = Promise.method((condition, action) => {
  if (condition()) return

  return action().then(_promiseWhile.bind(null, condition, action))
})

exports.while = _promiseWhile
