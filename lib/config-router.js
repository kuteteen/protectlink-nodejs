'use strict'

const middlewares = require('./middleware')

module.exports = (Router) => {
  Router.use(middlewares.basic.serveStatic)

  Router.use(middlewares.basic.cookieParser)

  Router.use(middlewares.basic.bodyParser)

  Router.use(middlewares.basic.querystringParser)

  Router.use(middlewares.basic.cookieSession)

  Router.use(middlewares.render)

  Router.use(middlewares.json)

  return Router
}
