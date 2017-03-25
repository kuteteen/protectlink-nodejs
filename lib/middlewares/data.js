'use strict'

const {db} = require('../promise')

exports.info = (req, res, next) => {
  res.locals = res.locals || {}
  res.locals.groupId = process.env.GROUP_ID || ''
  res.locals.demo = process.env.DEMO_MODE || false

  next()
}

exports.link = (req, res, next) => {
  let excludeRoutes = [
    'create',
    'edit'
  ]

  if (excludeRoutes.includes(req.params.id)) return next()

  db.get([req.session.user.id, req.params.id])
    .then(data => {
      res.locals = res.locals || {}
      res.locals.link = data

      return next()
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

      return next()
    })
    .catch(() => {
      return res.return404()
    })
}
