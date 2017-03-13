'use strict'

const {redirect} = require('../helper')

exports.preLoginCheck = (req, res, next) => {
  if (req.session.auth) {
    res.statusCode = 400
    return res.end('Bad request')
  }

  next()
}

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.auth) {
    return redirect(res, '/login')
  }

  next()
}
