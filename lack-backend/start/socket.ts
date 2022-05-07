/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')
  .on('changeStatus', 'ActivityController.changeStatus')
  .on('inviteUser', 'ChannelController.inviteUser')

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  .on('addMessage', 'MessageController.addMessage')
  .on('addUser', 'ChannelController.addUser')
  .on('removeUser', 'ChannelController.removeUser')
  .on('deleteChannel', 'ChannelController.deleteChannel')
  .on('typing', 'ChannelController.typing')
  .on('kickUser', 'ChannelController.kickUser')
