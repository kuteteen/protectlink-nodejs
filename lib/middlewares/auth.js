'use strict'

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.auth) return res.redirect('/profile')

  next()
}

exports.requireAuthentication = (req, res, next) => {
  let originalUrl = encodeURIComponent(req.originalUrl)

  if (!req.session.auth) return res.redirect(`/login?return=${originalUrl}`)

  next()
}
