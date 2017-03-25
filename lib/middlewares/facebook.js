'use strict'

const log = require('fancy-log')
const {graphApi} = require('../service')
const {loop} = require('../promise')

exports.findPostIncludeHash = (req, res, next) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  if (link.postId) return next()

  let hash = `#protect@${res.locals.link.id}`
  let token = req.session.auth.access_token
  let node = process.env.GROUP_ID
  let opts = {
    fields: 'feed',
    limit: 20
  }

  log.info('> findPostIncludeHash')
  graphApi.consume(token, node, opts)
    .then(resp => {
      for (let post of resp.feed.data) {
        if (post.message && post.message.includes(hash)) {
          link._postId = post.id.replace(`${process.env.GROUP_ID}_`, '')
          log.info(`found (id: ${post.id} - hash: ${hash})`)

          return next()
        }
      }

      log.info(`not found (hash: ${hash})`)

      return next()
    })
    .catch(err => {
      return res.end(err)
    })
}

exports.checkIfUserIsGroupMember = (req, res, next) => {
  let sessionUser = req.session.user

  if (sessionUser.verified) return next()

  let token = req.session.auth.access_token
  let node = process.env.GROUP_ID + '/members'
  let opts = {
    limit: 1,
    after: ''
  }
  let done = false

  log.info('> checkIfUserIsGroupMember')
  loop.while(() => {
    return done
  }, () => {
    return graphApi.consume(token, node, opts)
      .then(resp => {
        for (let user of resp.data) {
          if (sessionUser.id === user.id) {
            res.locals._verified = true
            done = true
            log.info(`found (id: ${user.id})`)

            return done
          }
        }

        if (!resp.paging.next) {
          done = true
          log.info(`not found (id: ${sessionUser.id})`)

          return done
        }

        opts.after = resp.paging.cursors.after
      })
  })
    .then(() => {
      return next()
    })
}
