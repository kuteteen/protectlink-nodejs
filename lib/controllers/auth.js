'use strict'

const {loginFacebook} = require('../service')

exports.login = (req, res) => {
  res.render('auth/login')
}

exports.facebook = (req, res) => {
  return res.redirect(loginFacebook.invokeUri, 302)
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) return res.redirect('/login')

  loginFacebook.callback(req.query.code)
    .then(data => {
      req.session.auth = data
      res.redirect('/user/profile')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.logout = (req, res) => {
  req.session.auth = null

  res.redirect('/login')
}
