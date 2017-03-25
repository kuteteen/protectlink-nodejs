'use strict'

exports.link = (req, res, next) => {
  let link = req.body
  let errors = []

  // Delete unnecessary things
  delete link._csrf

  if (!link.passwordLock) delete link.password

  if (!link.count) {
    delete link.count
    delete link.type
  }

  link.count = parseInt(link.count)

  // Validate
  if (!link.url) errors.push('url can\'t be blank')

  if (!link.passwordLock && !link.reactLock && !link.countLock) errors.push('please choose at least one protection method')

  if (!link.password) errors.push('password can\'t be blank')

  if (!link.count) errors.push('you must specify count')

  if (!link.type) errors.push('you must specify type of count lock')

  if (link.count < 1) errors.push('count must be greater than 1')

  res.locals.link = link
  res.locals.errors = errors

  return next()
}
