'use strict'

exports.authenticated = req => {
  if (!req.session.auth) {
    return false
  }
  
  return true
}
