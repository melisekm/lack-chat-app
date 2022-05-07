/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.get('channels/:name', 'ChannelController.getChannel').middleware('auth')
Route.get(
  'channels/:name/admin',
  'ChannelController.checkIfUserIsAdmin'
).middleware('auth')
Route.get('channels', 'ChannelController.getUserChannels').middleware('auth')
Route.post('channels', 'ChannelController.createChannel').middleware('auth')
Route.post(
  'channels/:name/acceptInvite',
  'ChannelController.acceptInvite'
).middleware('auth')
Route.get(
  'channels/:name/check',
  'ChannelController.tryToJoinChannel'
).middleware('auth')

Route.get(
  'channels/:name/messages',
  'MessagesController.loadMessages'
).middleware('auth')
