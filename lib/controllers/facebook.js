'use strict'

const {graphApi} = require('../service')

exports.getUser = (req, res, next) => {
  if (req.session.user) return next()

  let token = req.session.auth.access_token
  let opts = {
    fields: 'id,name'
  }

  graphApi.consume(token, 'me', opts)
    .then(resp => {
      req.session.user = resp

      next()
    })
    .catch(err => {
      res.end(err)
    })
}

exports.findHashInGroupPosts = (req, res, next) => {
  let token = req.session.auth.access_token
  let node = process.env.GROUP_ID
  let opts = {
    fields: 'feed'
  }

  let hash = `#protect@${res.locals.link.hash}`

  graphApi.consume(token, node, opts)
    .then(resp => {
      res.locals = res.locals || {}

      for (let post of resp.feed.data) {
        if (post.message && post.message.includes(hash)) {
          res.locals.link.postId = post.id

          return next()
        }
      }

      res.locals.link.postId = ''

      return next()
    })
    .catch(err => {
      res.end(err)
    })
}
