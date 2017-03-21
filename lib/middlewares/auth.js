'use strict'

const {graphApi} = require('../service')

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

exports.attachUserSessionIfAuthenticated = (req, res, next) => {
  if (!req.session.auth) return next()

  if (req.session.user) return next()

  let token = req.session.auth.access_token
  let opts = {
    fields: 'id,name'
  }

  graphApi.consume(token, 'me', opts)
    .then(resp => {
      req.session.user = resp

      next()
    })
    .catch(err => {
      res.end(err)
    })
}
