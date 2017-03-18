'use strict'

const Router = require('router')
const configRouter = require('./config-router')
const controller = require('./controller')

const Route = configRouter(Router())

// Home
Route.get('/', controller.home.index)

// Login
Route.get('/login', controller.auth.login)
Route.get('/login/facebook', controller.auth.facebook)
Route.get('/login/facebook/auth', controller.auth.facebookCallback)
Route.get('/logout', controller.auth.logout)

// User
Route.get('/profile',
  controller.facebook.getUser,
  controller.user.index
)

// Link
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
