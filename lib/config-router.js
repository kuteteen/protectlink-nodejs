'use strict'

const middleware = require('./middleware')

module.exports = (Router) => {
  Router.use(middleware.basic.serveStatic)
  Router.use(middleware.basic.cookieSession)
  Router.use(middleware.basic.cookieParser)
  Router.use(middleware.basic.bodyParser)
  Router.use(middleware.basic.querystringParser)
  Router.use(middleware.basic.attachInfo)

  Router.use(middleware.protection.helmet)
  Router.use(middleware.protection.csrf)
  Router.use(middleware.protection.attachCSRFToken)

  Router.use(middleware.res.redirect)
  Router.use(middleware.res.render)
  Router.use(middleware.res.json)

  Router.use('/login', middleware.auth.redirectIfAuthenticated)

  Router.use('/logout', middleware.auth.requireAuthentication)
  Router.use('/profile', middleware.auth.requireAuthentication)
  Router.use('/link', middleware.auth.requireAuthentication)
  Router.use('/unprotect', middleware.auth.requireAuthentication)

  Router.use('/link/:id', middleware.db.getAndAttachLinkData)
  Router.use('/unprotect/:unprotectId', middleware.db.getAndAttachUnprotectData)

  return Router
}
