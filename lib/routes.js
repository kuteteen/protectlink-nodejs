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
Route.get('/profile', controller.user.index)

// Link
Route.get('/link', controller.link.index)
Route.get('/link/create', controller.link.create)
Route.post('/link', controller.link.store)
Route.get('/link/:id', controller.link.show)
Route.get('/link/:id/edit', controller.link.edit)
Route.post('/link/:id', controller.link.update)
Route.get('/link/:id/instruction', controller.link.instruction)
Route.get('/link/:id/update/auto',
  controller.facebook.findPostIncludeHash,
  controller.link.autoUpdate
)
Route.get('/link/:id/delete', controller.link.destroy)

// Unprotect
// Route.get('/unprotect/:unprotectId', controller.unprotect.show)
Route.get('/unprotect/:unprotectId', (req, res) => {
  return res.end(req.originalUrl)
})

module.exports = Route
