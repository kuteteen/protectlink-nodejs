'use strict'

exports.redirect = (res, uri) => {
  res.setHeader('Location', uri)
  res.statusCode = 302
  res.end()
}
