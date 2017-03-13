'use strict'

const {graphApi} = require('../service')

exports.profile = (req, res) => {
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
