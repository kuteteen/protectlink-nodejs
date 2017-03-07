'use strict'

const {graphApi} = require('../service')
const {request} = require('../helper')
const {response} = require('../helper')

exports.index = (req, res) => {
  if (!request.authenticated(req)) return response.redirect(res, '/login')

  let token = req.session.auth.access_token

  graphApi.consume(
    process.env.GROUP_ID,
    {
      fields: 'feed'
    },
    token
  )
    .then(resp => {
      for (let obj of resp.feed.data) {
        if (obj.message && obj.message.includes('#protect')) return obj.id
      }
    })
    .then(id => {
      return graphApi.consume(
        id,
        {
          fields: 'reactions'
        },
        token
      )
    })
    .then(data => {
      return res.render('home', {
        id: data.id,
        reactions: data.reactions.data
      })
    })
    .catch(err => {
      console.log(err)
    })
}
