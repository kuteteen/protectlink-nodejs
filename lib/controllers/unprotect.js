'use strict'

exports.show = (req, res) => {
  return res.json(res.locals.unprotect)
}
