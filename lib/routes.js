'use strict'

const Router = require('router')
const configRouter = require('./config-router')
const controller = require('./controller')

let Route = configRouter(Router())

Route.get('/', controller.home.index)

Route.get('/login', controller.auth.login)
Route.get('/login/facebook', controller.auth.facebook)
Route.get('/login/facebook/auth', controller.auth.facebookCallback)
Route.get('/logout', controller.auth.logout)

Route.get('/profile',
  controller.facebook.getUser,
  controller.user.index
)

Route.get('/link', controller.link.index)
Route.get('/link/create', controller.link.create)
Route.post('/link', controller.link.store)
Route.get('/link/:id', controller.link.show)
Route.get('/link/:id/instruction', controller.link.instruction)
Route.get('/link/:id/check',
  controller.link.prepareCheck,
  controller.facebook.findHashInGroupPosts,
  controller.link.check
)

module.exports = Route
