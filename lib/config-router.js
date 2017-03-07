'use strict'

const middleware = require('./middleware')

module.exports = (Router) => {
  Router.use(middleware.basic.serveStatic)
  Router.use(middleware.basic.cookieParser)
  Router.use(middleware.basic.bodyParser)
  Router.use(middleware.basic.querystringParser)
  Router.use(middleware.basic.cookieSession)
  Router.use(middleware.resRender)
  Router.use(middleware.resJson)

  return Router
}
