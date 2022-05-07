// import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
// import type { UserRepositoryContract } from '@ioc:Repositories/UserRepository'
import { inject } from '@adonisjs/core/build/standalone'

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/UserRepository'])
export default class UserController {
  // constructor(private userRepository: UserRepositoryContract) {}
  // public async loadUsers({ params }: WsContextContract) {
  //   console.log('loadUsers', params)
  //   return this.userRepository.findAllByChannelName(params.name)
  // }
  //
  // public async addUser({ params, socket }: WsContextContract) {
  //   const user = await this.userRepository.add(params.id)
  //   // broadcast user to other users in channel
  //   socket.broadcast.emit('addUser', user)
  //   // return user to sender
  //   return user
  // }
}
