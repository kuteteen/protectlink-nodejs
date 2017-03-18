'use strict'

const qs = require('querystring')
const url = require('url')
const {resolve} = require('path')

exports.serveStatic = require('serve-static')(
  resolve(__dirname, '..', '..', 'public'), {}
)

exports.cookieSession = require('cookie-session')({
  name: 'session',
  secret: process.env.SECRET
})

exports.cookieParser = require('cookie-parser')()

exports.bodyParser = require('body-parser').urlencoded({ extended: false })

exports.querystringParser = (req, res, next) => {
  req.query = qs.parse(
    url.parse(req.url).query
  )

  next()
}

exports.attachInfo = (req, res, next) => {
  res.locals = res.locals || {}
  res.locals.groupId = process.env.GROUP_ID

  next()
}
