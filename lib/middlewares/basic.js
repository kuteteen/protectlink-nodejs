'use strict'

const qs = require('querystring')
const url = require('url')
const {resolve} = require('path')

exports.serveStatic = require('serve-static')(
  resolve(__dirname, '..', '..', 'public'), {}
)

exports.cookieSession = require('cookie-session')({
  name: 'session',
  secret: process.env.APP_SECRET || 'keyboard_kitten',
  maxAge: 30 * 60 * 1000 // 30 mins per session
})

exports.cookieParser = require('cookie-parser')(process.env.APP_SECRET || 'keyboard_kitten')

exports.bodyParser = require('body-parser').urlencoded({ extended: false })

exports.querystringParser = (req, res, next) => {
  req.query = qs.parse(
    url.parse(req.url).query
  )

  next()
}

exports.flash = () => {
  return (req, res, next) => {
    if (req.flash) return next()

    req.flash = _flash
    next()
  }
}

exports.attachInfo = (req, res, next) => {
  res.locals = res.locals || {}
  res.locals.groupId = process.env.GROUP_ID

  next()
}

let _flash = (type, msg) => {
  this.session.flash = this.session.flash || {}

  let messages = this.session.flash

  if (type && msg) {
    return (messages[type] = messages[type] || []).push(msg)
  }

  if (type && !msg) {
    let arr = messages[type]
    delete messages[type]

    return arr || []
  }

  this.session.flash = null

  return messages
}
