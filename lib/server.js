'use strict'

const http = require('http')
const routes = require('./routes')
const finalhandler = require('finalhandler')

let requestListener = (req, res) => {
  routes(req, res, finalhandler(req, res))
}

module.exports = http.createServer(requestListener)
