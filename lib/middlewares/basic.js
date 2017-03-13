'use strict'

const qs = require('querystring')
const url = require('url')
const {resolve} = require('path')

exports.serveStatic = require('serve-static')(
  resolve(__dirname, '..', '..', 'public'), {}
)

exports.cookieParser = require('cookie-parser')()

exports.bodyParser = require('body-parser').urlencoded({ extended: false })

exports.querystringParser = (req, res, next) => {
  req.query = qs.parse(
    url.parse(req.url).query
  )

  next()
}

exports.cookieSession = require('cookie-session')({
  name: 'session',
  secret: 'keyboard kitten'
})

exports.redirect = (req, res, next) => {
  res.redirect = (dest, statusCode) => {
    res.statusCode = Number(statusCode) || 303
    res.setHeader('Location', dest)
    res.end()
  }

  next()
}
