'use strict'

exports.index = (req, res) => {
  return res.render('layout.v1', {
    partials: {
      header: 'home/index.header',
      nav: 'home/index.nav',
      content: 'home/index.content'
    }
  })
}
