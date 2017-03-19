'use strict'

const db = require('../database')
const through2 = require('through2')
const shortid = require('shortid')

exports.index = (req, res) => {
  let user = req.session.user
  let links = []
  let hasData = false

  db.createReadStream({
    gt: [user.id, null],
    lt: [user.id, undefined],
    keys: false
  })
    .on('end', () => {
      if (links.length > 0) hasData = true

      res.render('layout.v1', {
        hasData: hasData,
        links: links,
        partials: {
          header: 'link/index.header',
          nav: 'link/index.nav',
          content: 'link/index.content'
        }
      })
    })
    .pipe(through2.obj((chunk, enc, next) => {
      links.push(chunk)

      next()
    }))
}

exports.create = (req, res) => {
  res.render('layout.v1', {
    partials: {
      header: 'link/create.header',
      nav: 'link/create.nav',
      content: 'link/create.content'
    }
  })
}

exports.store = (req, res) => {
  try {
    let user = req.session.user
    let link = req.body

    if (!link.url) throw new Error('url blank')

    if (link.passwordLock && !link.password) throw new Error('password blank')

    if (link.countLock && !link.count) throw new Error('count blank')

    link.id = shortid()
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

exports.check = (req, res) => {
  let user = req.session.user

  res.locals = res.locals || {}

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

    res.locals = res.locals || {}
    res.locals.link = val

    next()
  })
}
