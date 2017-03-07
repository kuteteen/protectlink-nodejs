'use strict'

exports.index = (req, res) => {
  if (req.session.auth) {
    res.setHeader('Location', '/user/profile')
    res.statusCode = 302
    res.end()
    return
  }

  res.render('home', {
    name: 'Nguyen',
    msg: 'Hello World'
  })
}
