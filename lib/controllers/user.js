'use strict'

const graphApi = require('../graph-api')

exports.profile = (req, res) => {
  graphApi.request(
    'me',
    {
      field: 'id,name'
    },
    req.session.access_token
  )
    .then(data => {
      console.log(data)
      res.render('user/profile', {
        id: data.id,
        name: data.name
      })
    })
    .catch(err => {
      console.log(err)
    })
}
