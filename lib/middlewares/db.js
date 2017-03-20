'use strict'

const db = require('../database')

exports.getAndAttachLinkData = (req, res, next) => {
  let excludePattern = [
    'create',
    'edit'
  ]

  if (excludePattern.includes(req.params.id)) return next()

  let user = req.session.user

  db.get([user.id, req.params.id], (err, val) => {
    if (err) {
      res.statusCode = 404

      return res.end('404 Not Found')
    }

    res.locals = res.locals || {}
    res.locals.link = val

    next()
  })
}

exports.getAndAttachUnprotectData = (req, res, next) => {
  db.get(req.params.unprotectId, (err, val) => {
    if (err) {
      res.statusCode = 404

      return res.end('404 Not Found')
    }

    res.locals = res.locals || {}
    res.locals.unprotect = val

    next()
  })
}
