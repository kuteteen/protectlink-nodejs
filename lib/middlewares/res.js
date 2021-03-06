'use strict'

const consolidate = require('consolidate')
const {resolve} = require('path')

exports.redirect = (req, res, next) => {
  res.redirect = (dest, statusCode) => {
    res.statusCode = Number(statusCode) || 303
    res.setHeader('Location', dest)

    return res.end()
  }

  next()
}

exports.return404 = (req, res, next) => {
  res.return404 = () => {
    res.statusCode = 404

    return res.end(`Cannot GET ${req.originalUrl}`)
  }

  next()
}

exports.render = (req, res, next) => {
  res.render = (view, hash = {}) => {
    let viewpath = resolve(__dirname, '..', '..', 'resources', 'views', view + '.html')

    res.locals = res.locals || {}

    consolidate.mustache(
      viewpath,
      Object.assign(hash, res.locals),
      (err, html) => {
        if (err) throw err

        res.setHeader('Content-Type', 'text/html; charset=utf-8')

        return res.end(html)
      }
    )
  }

  next()
}

exports.json = (req, res, next) => {
  let json = obj => {
    return JSON.stringify(obj, null, 4)
  }

  res.json = obj => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    return res.end(json(obj))
  }

  next()
}
