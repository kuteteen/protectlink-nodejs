'use strict'

const {request} = require('../helper')
const {response} = require('../helper')

exports.index = (req, res) => {
  if (!request.authenticated(req)) return response.redirect(res, '/login')

  res.render('home', {
    msg: 'Hello World'
  })
}
