'use strict'

exports.show = (req, res) => {
  res.json(res.locals.unprotect)
}
