'use strict'

exports.index = (req, res) => {
  res.render('layout.v1', {
    user: req.session.user,
    partials: {
      header: 'user/index.header',
      nav: 'user/index.nav',
      content: 'user/index.content'
    }
  })
}
