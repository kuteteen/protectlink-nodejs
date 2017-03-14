'use strict'

const middleware = require('./middleware')

module.exports = (Router) => {
  Router.use(middleware.basic.serveStatic)
  Router.use(middleware.basic.cookieParser)
  Router.use(middleware.basic.bodyParser)
  Router.use(middleware.basic.querystringParser)
  Router.use(middleware.basic.cookieSession)
  Router.use(middleware.basic.redirect)
  Router.use(middleware.resRender)
  Router.use(middleware.resJson)

  Router.use('/login/facebook/auth', middleware.auth.checkFacebookLoginCallback)
  Router.use('/login', middleware.auth.redirectIfAuthenticated)

  Router.use('/logout', middleware.auth.guardRoute)

  Router.use('/user', middleware.auth.guardRoute)
  Router.use('/link', middleware.auth.guardRoute)

  return Router
}
