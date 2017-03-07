'use strict'

const graphApi = require('../graph-api')

exports.profile = (req, res) => {
  if (!req.session.auth) {
    res.setHeader('Location', '/')
    res.statusCode = 302
    res.end()
    return
  }

  graphApi.request(
    'me',
    {
      field: 'id,name'
    },
    req.session.auth.access_token
  )
    .then(data => {
      res.render('user/profile', {
        id: data.id,
        name: data.name
      })
    })
    .catch(err => {
      console.log(err)
    })
}
