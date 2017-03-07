'use strict'

const {graphApi} = require('../service')
const {request} = require('../helper')
const {response} = require('../helper')

exports.index = (req, res) => {
  if (!request.authenticated(req)) return response.redirect(res, '/login')

  graphApi.consume(
    process.env.GROUP_ID,
    {
      fields: 'feed'
    },
    req.session.auth.access_token
  )
    .then(resp => {
      let obj
      for (obj of resp.feed.data) {
        if (obj.message && obj.message.includes('#protect'))
          return obj.message
      }
    })
    .then(data => {
      res.end(data)
    })
    // .then(data => {
    //   res.render('home', {
    //     feeds: data.feed.data
    //   })
    // })
    .catch(err => {
      console.log(err)
    })
}
