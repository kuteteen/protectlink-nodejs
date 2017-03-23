'use strict'

const log = require('fancy-log')
const db = require('../database')
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

exports.attachUserSession = (req, res, next) => {
  if (!req.session.auth) return next()

  if (req.session.user) return next()

  let token = req.session.auth.access_token

  graphApi.consume(token, 'me')
    .then(resp => {
      req.session.user = resp
      log.info('user session attached')

      return next()
    })
    .catch(err => {
      return res.end(err)
    })
}

exports.assignVerificationStatus = (req, res, next) => {
  if (!req.session.auth) return next()

  if (!req.session.user) return next()

  if (req.session.user.verified) return next()

  let user = req.session.user

  _get(user.id)
    .then(data => {
      Object.assign(req.session.user, data)
      log.info('verification status assigned to user session')

      return next()
    })
    .catch(() => {
      return next()
    })
}

exports.requireVerifiedUser = (req, res, next) => {
  let routes = [
    'link',
    'unprotect'
  ]

  if (!routes.includes(req.params.route)) return next()

  if (!req.session.user.verified) return res.redirect('/profile')

  next()
}

let _get = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, val) => {
      if (err) reject()

      resolve(val)
    })
  })
}
