'use stricct'

const level = require('level')
const defaults = require('levelup-defaults')
const bytewise = require('bytewise')
const {resolve} = require('path')

let database = level(resolve(__dirname, '..', process.env.DATABASE_PATH || 'db'))

module.exports = defaults(database, {
  keyEncoding: bytewise,
  valueEncoding: 'json'
})
