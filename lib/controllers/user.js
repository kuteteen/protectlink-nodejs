'use strict'

const db = require('../database')

exports.index = (req, res) => {
  let user = req.session.user
  let done = false

  if (user.verified) done = true

  res.render('layout.v1', {
    user: req.session.user,
    done: done,
    success: req.flash('success'),
    err: req.flash('err'),
    partials: {
      header: 'user/index.header',
      nav: 'user/index.nav',
      content: 'user/index.content'
    }
  })
}

exports.verify = (req, res) => {
  let sessionUser = req.session.user

  res.locals = res.locals || {}

  if (!res.locals._verified) {
    req.flash('err', true)

    return res.redirect('/profile')
  }

  if(!sessionUser.verified) {
    let verified = res.locals._verified

    delete res.locals._verified

    db.put(sessionUser.id, {
      verified: verified
    })
  }

  req.flash('success', true)

  res.redirect('/profile')
}
