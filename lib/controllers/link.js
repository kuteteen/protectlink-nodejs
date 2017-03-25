'use strict'

const db = require('../database')
const through2 = require('through2')
const shortid = require('shortid')
const crypto = require('crypto')
const {isEmpty} = require('lodash')

exports.index = (req, res) => {
  let user = req.session.user
  let links = []

  db.createReadStream({
    gt: [user.id, null],
    lt: [user.id, undefined],
    keys: false
  })
    .on('end', () => {
      return res.render('layout.v1', {
        hasData: (!isEmpty(links)),
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
  let err = req.flash('err')

  return res.render('layout.v1', {
    hasErr: (!isEmpty(err)),
    err: err,
    partials: {
      header: 'link/create.header',
      nav: 'link/details.nav',
      content: 'link/create.content'
    }
  })
}

exports.store = (req, res) => {
  let user = req.session.user
  let link = res.locals.link
  let errors = res.locals.errors

  if (!errors) {
    link.id = shortid()
    link.unprotectId = crypto.createHmac('sha256', process.env.APP_SECRET || 'keyboard_kitten')
      .update(link.id)
      .digest('hex')
    link.displayUrl = link.url

    if (link.url.length > 45 && link.url.substring(44).length > 7) {
      link.displayUrl = link.url.substring(0, 45) + '...'
    }

    db.put([user.id, link.id], link)
    db.put(link.unprotectId, {
      userId: user.id,
      linkId: link.id
    })

    return res.redirect(`/link/${link.id}/instruction`)
  }

  req.flash('err', errors)

  return res.redirect('/link/create')
}

exports.show = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  if (!link.postId) return res.redirect(`/link/${link.id}/instruction`)

  return res.json(link)
}

exports.edit = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  return res.render('layout.v1', {
    link: link,
    partials: {
      header: 'link/edit.header',
      nav: 'link/details.nav',
      content: 'link/edit.content'
    }
  })
}

exports.update = (req, res) => {
  return res.end('update')
}

exports.instruction = (req, res) => {
  res.locals = res.locals || {}

  let link = res.locals.link

  return res.render('layout.v1', {
    host: req.headers.host,
    link: link,
    hasDone: (link.postId),
    err: req.flash('err'),
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

  let link = res.locals.link

  if (!link._postId) {
    req.flash('err', true)

    return res.redirect(`/link/${link.id}/instruction`)
  }

  if (!link.postId) {
    link.postId = link._postId
    delete link._postId

    db.put([user.id, link.id], link)
  }

  return res.redirect(`/link/${link.id}`)
}

exports.destroy = (req, res) => {
  let user = req.session.user

  res.locals = res.locals || {}

  let link = res.locals.link

  db.del([user.id, link.id])

  return res.redirect('/link')
}
