'use strict'

const qs = require('querystring')
const url = require('url')
const {resolve} = require('path')
const {isArray} = require('lodash')

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

exports.flash = (req, res, next) => {
  req.flash = (type, msg) => {
    req.session.flash = req.session.flash || {}

    let messages = req.session.flash

    if (type && msg) {
      if (isArray(msg)) {
        for (let val in msg) {
          (messages[type] = messages[type] || []).push(msg[val])
        }

        return
      }

      return (messages[type] = messages[type] || []).push(msg)
    }

    if (type) {
      let arr = messages[type] || []

      delete messages[type]

      return arr
    }

    req.session.flash = {}

    return messages
  }

  next()
}
