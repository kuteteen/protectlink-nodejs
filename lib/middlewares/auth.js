'use strict'

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.auth) return res.redirect('/profile')

  next()
}

exports.requireAuthentication = (req, res, next) => {
  if (!req.session.auth) return res.redirect('/login')

  next()
}
