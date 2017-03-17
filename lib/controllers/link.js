'use strict'

const db = require('../database')
const through2 = require('through2')
const cuid = require('cuid')
const shortid = require('shortid')

exports.index = (req, res) => {
  let user = req.session.user
  let links = []

  db.createReadStream({
    gt: [user.id, null],
    lt: [user.id, undefined],
    keys: false
  })
    .on('end', () => {
      res.render('link/index', {
        links: links
      })
    })
    .pipe(through2.obj((chunk, enc, next) => {
      links.push(chunk)
      next()
    }))
}

exports.create = (req, res) => {
  res.render('link/create')
}

exports.store = (req, res) => {
  try {
    let user = req.session.user
    let link = req.body

    console.log(req.body)

    if (!link.url) throw new Error('url blank')

    if (link.passwordLock && !link.password) throw new Error('password blank')

    if (link.countLock && !link.count) throw new Error('count blank')

    link.id = cuid()
    link.hash = shortid()
    delete link._csrf

    db.put([user.id, link.id], link)

    res.redirect(`/link/${link.id}`)
  } catch (err) {
    res.end(err.message)
  }
}

exports.show = (req, res) => {
  let user = req.session.user

  db.get([user.id, req.params.id], (err, val) => {
    if (err) {
      res.statusCode = 404
      return res.end(`Cannot GET /link/${req.params.id}`)
    }

    if (!val.postId) {
      return res.redirect(`/link/${val.id}/instruction`)
    }

    res.json(val)
  })
}

exports.instruction = (req, res) => {
  res.end()
}

exports.check = (req, res, next) => {
  let user = req.session.user

  if (!res.locals.link.postId) res.end('no post')

  db.put([user.id, req.params.id], res.locals.link)

  res.redirect(`/link/${res.locals.link.id}`)
}

exports.prepareCheck = (req, res, next) => {
  let user = req.session.user

  db.get([user.id, req.params.id], (err, val) => {
    if (err) {
      res.statusCode = 404
      return res.end(`Cannot GET /link/${req.params.id}`)
    }

    res.locals.link = val

    next()
  })
}
