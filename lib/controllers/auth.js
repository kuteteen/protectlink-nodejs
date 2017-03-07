'use strict'

const {loginFacebook} = require('../service')
const {request} = require('../helper')
const {response} = require('../helper')

exports.login = (req, res) => {
  res.render('auth/login')
}

exports.facebook = (req, res) => {
  response.redirect(res, loginFacebook.invokeUri)
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) return response.redirect(res, '/login')

  loginFacebook.callback(req.query.code)
    .then(data => {
      req.session.auth = data
      response.redirect(res, '/')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.logout = (req, res) => {
  if (request.authenticated(req)) {
    req.session.auth = null
  }

  response.redirect(res, '/login')
}