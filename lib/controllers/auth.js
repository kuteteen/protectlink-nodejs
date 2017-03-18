'use strict'

const {facebookLogin} = require('../service')

const CALLBACK_URI = `http://localhost:${process.env.PORT}/login/facebook/auth`

exports.login = (req, res) => {
  res.render('auth/login')
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
      req.session.auth = data

      res.redirect('/profile')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.logout = (req, res) => {
  req.session = null

  res.redirect('/')
}
