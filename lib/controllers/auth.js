'use strict'

const {loginFacebook} = require('../service')
const {redirect} = require('../helper')

exports.login = (req, res) => {
  res.render('auth/login')
}

exports.facebook = (req, res) => {
  redirect(res, loginFacebook.invokeUri)
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) return redirect(res, '/login')

  loginFacebook.callback(req.query.code)
    .then(data => {
      req.session.auth = data
      redirect(res, '/user/profile')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.logout = (req, res) => {
  req.session.auth = null

  redirect(res, '/login')
}
