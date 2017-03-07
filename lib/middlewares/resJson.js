'use strict'

module.exports = (req, res, next) => {
  let json = obj => {
    return JSON.stringify(obj, null, 4)
  }

  res.json = obj => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(json(obj))
  }

  next()
}
