'use strict'

const service = require('../service')

exports.facebook = (req, res) => {
  res.setHeader('Location', service.loginFacebook.invokeUri)
  res.statusCode = 302
  res.end()
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) {
    res.setHeader('Location', '/')
    res.statusCode = 302
    res.end()
    return
  }

  service.loginFacebook.callback(req.query.code)
    .then(data => {
      req.session.auth = data
      res.setHeader('Location', '/user/profile')
      res.statusCode = 302
      res.end()
    })
    .catch(err => {
      console.log(err)
    })
}

exports.logout = (req, res) => {
  if (req.session.auth) {
    req.session.auth = null
  }

  res.setHeader('Location', '/')
  res.statusCode = 302
  res.end()
}