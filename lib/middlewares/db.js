'use strict'

const db = require('../database')

exports.attachLinkData = (req, res, next) => {
  let excludeRoutes = [
    'create',
    'edit'
  ]

  if (excludeRoutes.includes(req.params.id)) return next()

  let user = req.session.user

  _db([user.id, req.params.id])
    .then(data => {
      res.locals = res.locals || {}
      res.locals.link = data

      next()
    })
    .catch(() => {
      return res.return404()
    })
}

exports.attachUnprotectData = (req, res, next) => {
  _db(req.params.unprotectId)
    .then(data => {
      res.locals = res.locals || {}
      res.locals.unprotect = data

      next()
    })
    .catch(() => {
      return res.return404()
    })
}

let _db = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, val) => {
      if (err) reject()

      resolve(val)
    })
  })
}
