'use strict'

const {graphApi} = require('../service')

exports.index = (req, res) => {
  let token = req.session.auth.access_token

  graphApi.consume(process.env.GROUP_ID, { fields: 'feed' }, token)
    .then(resp => {
      for (let obj of resp.feed.data)
        if (obj.message && obj.message.includes('#protect')) return obj.id
    })
    .then(id => {
      return graphApi.consume(id, { fields: 'reactions' }, token)
    })
    .then(data => {
      return res.render('link/index', {
        id: data.id,
        reactions: data.reactions.data
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.create = (req, res) => {
  res.render('link/create')
}

exports.store = (req, res) => {
  res.end('ended!!')
}
