'use strict'

const {db} = require('../service')

exports.link = (req, res, next) => {
  let excludeRoutes = [
    'create',
    'edit'
  ]

  if (excludeRoutes.includes(req.params.id)) return next()

  let user = req.session.user

  db.get([user.id, req.params.id])
    .then(data => {
      res.locals = res.locals || {}
      res.locals.link = data

      next()
    })
    .catch(() => {
      return res.return404()
    })
}

exports.unprotect = (req, res, next) => {
  db.get(req.params.unprotectId)
    .then(data => {
      res.locals = res.locals || {}
      res.locals.unprotect = data

      next()
    })
    .catch(() => {
      return res.return404()
    })
}
