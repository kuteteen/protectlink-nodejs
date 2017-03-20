'use strict'

const {facebookLogin} = require('../service')

const CALLBACK_URI = `http://localhost:${process.env.PORT}/login/facebook/auth`

exports.login = (req, res) => {
  if (req.query.return) req.session.return = req.query.return

  res.render('layout.v1', {
    partials: {
      header: 'auth/login.header',
      nav: 'auth/login.nav',
      content: 'auth/login.content'
    }
  })
}

exports.facebook = (req, res) => {
  let invokeUri = facebookLogin.createInvokeUri(CALLBACK_URI)

  return res.redirect(invokeUri, 302)
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) {
    res.statusCode = 400

    return res.end('bad request')
  }

  facebookLogin.callback(CALLBACK_URI, req.query.code)
    .then(data => {
      let returnUrl = ''

      if (req.session.return) {
        returnUrl = decodeURIComponent(req.session.return)
        req.session.return = null
      }

      req.session.auth = data

      res.redirect(returnUrl || '/profile')
    })
    .catch(err => {
      res.end(err)
    })
}

exports.logout = (req, res) => {
  req.session = null

  res.redirect('/')
}
