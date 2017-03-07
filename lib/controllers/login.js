'use strict'

const service = require('../service')

exports.facebook = (req, res) => {
  res.setHeader('Location', service.loginFacebook.invokeUri)
  res.statusCode = 302
  res.end()
}

exports.facebookCallback = (req, res) => {
  if (!req.query.code) {
    return res.render('home')
  }

  if (req.session !== null) req.session = null
  console.log('---------clear session')
  console.log(req.session)

  service.loginFacebook.callback(req.query.code)
    .then(data => {
      req.session = data
      console.log('---------login/facebook/auth')
      console.log(req.session)
      res.setHeader('Location', service.loginFacebook.profileUri)
      res.statusCode = 301
      res.end()
    })
    .catch(err => {
      console.log(err)
    })
}
