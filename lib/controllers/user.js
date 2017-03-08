'use strict'

const {graphApi} = require('../service')
const {request} = require('../helper')
const {response} = require('../helper')

exports.profile = (req, res) => {
  if (!request.authenticated(req)) return response.redirect(res, '/login')

  graphApi.consume(
    'me',
    {
      field: 'id,name'
    },
    req.session.auth.access_token
  )
    .then(data => {
      return res.render('user/profile', {
        id: data.id,
        name: data.name
      })
    })
    .catch(err => {
      console.log(err)
    })
}
