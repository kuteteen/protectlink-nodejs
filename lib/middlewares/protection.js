'use strict'

exports.helmet = require('helmet')()

exports.csrf = require('csurf')({
  cookie: true
})

exports.attachCSRFToken = (req, res, next) => {
  res.locals = res.locals || {}
  res.locals.csrfToken = req.csrfToken()
  next()
}
