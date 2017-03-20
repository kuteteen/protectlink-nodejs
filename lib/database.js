'use stricct'

const level = require('level')
const defaults = require('levelup-defaults')
const bytewise = require('bytewise')
const {resolve} = require('path')

const database = level(resolve(__dirname, '..', process.env.DATABASE_PATH || 'database'))

module.exports = defaults(database, {
  keyEncoding: bytewise,
  valueEncoding: 'json'
})
