'use strict'

const Promise = require('bluebird')
const {graphApi} = require('../service')

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

          return next()
        }
      }

      return next()
    })
    .catch(err => {
      return res.end(err)
    })
}

exports.checkIfUserIsGroupMember = (req, res, next) => {
  let sessionUser = req.session.user

  if(sessionUser.verified) return next()

  let token = req.session.auth.access_token
  let node = process.env.GROUP_ID + '/members'
  let opts = {
    limit: 1,
    after: ''
  }
  let done = false

  _promiseWhile(() => {
    return done
  }, () => {
    return graphApi.consume(token, node, opts)
      .then(resp => {
        for (let user of resp.data) {
          if (sessionUser.id === user.id) {
            console.log(`found ${user.id}`)
            res.locals._verified = true
            done = true

            return done
          }
        }

        if (!resp.paging.next) {
          done = true

          return done
        }

        opts.after = resp.paging.cursors.after
      })
  })
    .then(() => {
      console.log('consume done')
      next()
    })
}

let _promiseWhile = Promise.method((condition, action) => {
  if (condition()) return

  return action().then(_promiseWhile.bind(null, condition, action))
})
