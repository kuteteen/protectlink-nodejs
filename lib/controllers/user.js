'use strict'

const got = require('got')

let meApiUri = 'https://graph.facebook.com/' + process.env.API_VERSION + '/me?access_token='

exports.profile = (req, res) => {
  console.log(req.session)
  if (!req.session.authenticated) return res.render('user/profile')

  let opts = {
    json: true,
    timeout: 3000,
    retries: 0
  }

  let user = {}

  console.log(req.session)

  got(meApiUri + req.session.access_token, opts)
    .then(resp => {
      user = resp.body
    })
    .catch(err => {
      console.log(err.response.body)
    })
  res.render('user/profile', {
    id: user.id,
    name: user.name
  })
}