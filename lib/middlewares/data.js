'use strict'

const log = require('fancy-log')
const db = require('../database')

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

  let user = req.session.user

  _get([user.id, req.params.id])
    .then(data => {
      res.locals = res.locals || {}
      res.locals.link = data
      log.info('link data attached')

      return next()
    })
    .catch(() => {
      return res.return404()
    })
}

exports.unprotect = (req, res, next) => {
  _get(req.params.unprotectId)
    .then(data => {
      res.locals = res.locals || {}
      res.locals.unprotect = data
      log.info('attached unprotect data')

      return next()
    })
    .catch(() => {
      return res.return404()
    })
}

let _get = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, val) => {
      if (err) reject()

      resolve(val)
    })
  })
}
