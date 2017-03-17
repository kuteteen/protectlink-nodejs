'use strict'

const {graphApi} = require('../service')

exports.getUser = (req, res, next) => {
  graphApi.consume(req.session.auth.access_token, 'me',
    {
      fields: 'id,name'
    }
  )
    .then(data => {
      req.session.user = data
      res.locals.user = data
      next()
    })
    .catch(err => {
      console.log(err)
    })
}

exports.findHashInGroupPosts = (req, res, next) => {
  let token = req.session.auth.access_token
  let hash = `#protect@${res.locals.link.hash}`

  graphApi.consume(token, process.env.GROUP_ID,
    {
      fields: 'feed'
    }
  )
    .then(resp => {
      for (let obj of resp.feed.data) {
        if (obj.message && obj.message.includes(hash)) {
          res.locals.link.postId = obj.id
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
