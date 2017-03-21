'use strict'

const middleware = require('./middleware')

module.exports = (Router) => {
  Router.use(middleware.basic.serveStatic)
  Router.use(middleware.basic.cookieSession)
  Router.use(middleware.basic.cookieParser)
  Router.use(middleware.basic.bodyParser)
  Router.use(middleware.basic.querystringParser)
  Router.use(middleware.basic.flash)
  Router.use(middleware.basic.attachInfo)

  Router.use(middleware.protection.helmet)
  Router.use(middleware.protection.csrf)
  Router.use(middleware.protection.attachCSRFToken)

  Router.use(middleware.res.redirect)
  Router.use(middleware.res.return404)
  Router.use(middleware.res.render)
  Router.use(middleware.res.json)

  Router.use('/login', middleware.auth.redirectIfAuthenticated)
  Router.use('/:route', middleware.auth.requireAuthentication)
  Router.use(middleware.auth.attachUserSessionIfAuthenticated)

  Router.use('/link/:id', middleware.db.attachLinkData)
  Router.use('/unprotect/:unprotectId', middleware.db.attachUnprotectData)

  return Router
}
