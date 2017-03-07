'use strict'

const Router = require('router')
const configRouter = require('./config-router')
const controller = require('./controller')

let Route = configRouter(Router())

Route.get('/', controller.home.index)
Route.get('/login/facebook', controller.auth.facebook)
Route.get('/login/facebook/auth', controller.auth.facebookCallback)
Route.get('/logout', controller.auth.logout)
Route.get('/user/profile', controller.user.profile)

module.exports = Route
