'use strict'

module.exports = (res, uri) => {
  res.setHeader('Location', uri)
  res.statusCode = 302
  res.end()
}
