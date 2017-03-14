'use strict'

exports.checkFacebookLoginCallback = (req, res, next) => {
  if (!req.query.code) {
    res.statusCode = 400
    return res.end('Bad request')
  }

  next()
}

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.auth) return res.redirect('/user/profile')

  next()
}

exports.guardRoute = (req, res, next) => {
  if (!req.session.auth) return res.redirect('/login')

  next()
}
