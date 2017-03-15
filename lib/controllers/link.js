'use strict'

const database = require('../database')
const through2 = require('through2')
const cuid = require('cuid')
const shortid = require('shortid')

exports.index = (req, res) => {
  let links = []

  database.createReadStream({
    gt: ['link', null],
    lt: ['link', undefined],
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

exports.store = (req, res, next) => {
  console.log(req.body)

  try {
    let link = req.body

    if (!link.url) throw new Error('url blank')

    if (link.passwordLock && !link.password) throw new Error('password blank')

    if (link.minReactionLock && !link.minReaction) throw new Error('minReaction blank')

    link.id = cuid()
    link.hash = shortid()
    delete link._csrf
    database.put(['link', link.id], link)
    res.locals.success = true
  } catch (err) {
    res.locals.err = true
  }

  next()
}
