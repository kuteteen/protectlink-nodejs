'use strict'

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.auth) return res.redirect('/profile')

  next()
}

exports.requireAuthentication = (req, res, next) => {
  let routes = [
    'logout',
    'profile',
    'link',
    'unprotect'
  ]

  if (!routes.includes(req.params.route)) return next()

  let query = ''

  if (req.originalUrl !== '/logout') {
    let encodedReturnUrl = encodeURIComponent(req.originalUrl)

    query = `?returnUrl=${encodedReturnUrl}`
  }

  if (!req.session.auth) return res.redirect(`/login${query}`)

  next()
}
