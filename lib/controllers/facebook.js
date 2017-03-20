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

exports.findPostIncludeHash = (req, res, next) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  if (link.postId) return next()

  let hash = `#protect@${res.locals.link.id}`
  let token = req.session.auth.access_token
  let node = process.env.GROUP_ID
  let opts = {
    fields: 'feed'
  }

  graphApi.consume(token, node, opts)
    .then(resp => {
      for (let post of resp.feed.data) {
        if (post.message && post.message.includes(hash)) {
          link._postId = post.id.replace(`${process.env.GROUP_ID}_`, '')
        }
      }

      return next()
    })
    .catch(err => {
      res.end(err)
    })
}
