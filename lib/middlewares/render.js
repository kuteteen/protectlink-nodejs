'use strict'

const consolidate = require('consolidate')
const {resolve} = require('path')

module.exports = (req, res, next) => {
  res.render = (view, hash = {}) => {
    let viewpath = resolve(__dirname, '..', '..', 'resources', 'views', view + '.html')
    res.locals = res.locals || {}
    consolidate.mustache(
      viewpath,
      Object.assign(hash, res.locals),
      (err, html) => {
        if (err) throw err

        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
      }
    )
  }

  next()
}
