'use strict'

const Router = require('router')
const configRouter = require('./config-router')
const controller = require('./controller')

let Route = configRouter(Router())

Route.get('/', controller.home.index)
Route.get('/login/facebook', controller.login.facebook)
Route.get('/login/facebook/redirect', controller.login.facebookRedirect)
Route.get('/user/profile', controller.user.profile)

module.exports = Route
