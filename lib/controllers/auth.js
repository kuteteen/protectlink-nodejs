'use strict'

const log = require('fancy-log')
const {facebookLogin} = require('../service')

exports.login = (req, res) => {
  if (req.query.returnUrl) req.session.returnUrl = req.query.returnUrl

  return res.render('layout.v1', {
    partials: {
      header: 'auth/login.header',
      nav: 'auth/login.nav',
      content: 'auth/login.content'
    }
  })
}

exports.facebook = (req, res) => {
  const CALLBACK_URI = `http://${req.headers.host}/login/facebook/auth`

  log.info('> facebook login')

  let invokeUri = facebookLogin.createInvokeUri(CALLBACK_URI)

  return res.redirect(invokeUri, 302)
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) {
    res.statusCode = 400

    return res.end('bad request')
  }

  const CALLBACK_URI = `http://${req.headers.host}/login/facebook/auth`

  log.info('> facebook login callback')
  facebookLogin.callback(CALLBACK_URI, req.query.code)
    .then(data => {
      let returnUrl = ''

      if (req.session.returnUrl) {
        returnUrl = decodeURIComponent(req.session.returnUrl)
        req.session.returnUrl = null
      }

      req.session.auth = data

      return res.redirect(returnUrl || '/profile')
    })
    .catch(err => {
      return res.end(err)
    })
}

exports.logout = (req, res) => {
  log.info(`user logout (id: ${req.session.user.id})`)
  req.session = null

  return res.redirect('/')
}
