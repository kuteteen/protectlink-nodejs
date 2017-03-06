'use strict'

exports.index = (req, res) => {
  res.render('home', {
    name: 'Nguyen',
    msg: 'Hello World'
  })
}
