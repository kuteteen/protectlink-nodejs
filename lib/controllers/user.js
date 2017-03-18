'use strict'

exports.index = (req, res) => {
  res.render('user/index', {
    user: req.session.user
  })
}
