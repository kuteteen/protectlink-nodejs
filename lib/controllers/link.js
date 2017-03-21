'use strict'

const db = require('../database')
const through2 = require('through2')
const shortid = require('shortid')
const crypto = require('crypto')
const log = require('fancy-log')

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
      nav: 'link/details.nav',
      content: 'link/create.content'
    }
  })
}

exports.store = (req, res) => {
  try {
    let user = req.session.user
    let link = req.body

    if (!link.url) throw new Error('url blank')

    if (!link.passwordLock && !link.reactLock && !link.countLock) throw new Error('choose at least one protection method')

    if (link.passwordLock && !link.password) throw new Error('password blank')

    if (link.countLock && !link.count) throw new Error('count blank')

    if (!link.passwordLock) delete link.password

    if (!link.count) {
      delete link.count
      delete link.type
    }

    link.id = shortid()
    link.unprotectId = crypto.createHmac('sha256', process.env.APP_SECRET || 'keyboard_kitten').digest('hex')

    delete link._csrf

    log.info('put:')
    log.info(link)

    db.put([user.id, link.id], link)
    db.put(link.unprotectId, {
      userId: user.id,
      linkId: link.id
    })

    res.redirect(`/link/${link.id}`)
  } catch (err) {
    res.end(err.message)
  }
}

exports.show = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  if (!link.postId) return res.redirect(`/link/${link.id}/instruction`)

  res.json(link)
}

exports.edit = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  res.render('layout.v1', {
    link: link,
    partials: {
      header: 'link/edit.header',
      nav: 'link/details.nav',
      content: 'link/edit.content'
    }
  })
}

exports.update = (req, res) => {
  res.end('update')
}

exports.instruction = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  res.render('layout.v1', {
    host: req.headers.host,
    link: link,
    err: req.session.err,
    partials: {
      header: 'link/instruction.header',
      nav: 'link/details.nav',
      content: 'link/instruction.content'
    }
  })
}

exports.autoUpdate = (req, res) => {
  let user = req.session.user

  res.locals = res.locals || {}
  req.session.err = false

  let link = res.locals.link

  if (!link._postId) {
    req.session.err = true

    return res.redirect(`/link/${link.id}/instruction`)
  }

  if (!link.postId) {
    link.postId = link._postId
    delete link._postId

    log.info('put:')
    log.info(link)

    db.put([user.id, link.id], link)
  }

  res.redirect(`/link/${link.id}`)
}

exports.destroy = (req, res) => {
  let user = req.session.user

  res.locals = res.locals || {}

  let link = res.locals.link

  db.del([user.id, link.id])

  res.redirect('/link')
}
