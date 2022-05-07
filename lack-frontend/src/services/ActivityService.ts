import { Channel, SerializedUser, User } from 'src/contracts'
import { authManager } from '.'
import { BootParams, SocketManager } from './SocketManager'

class ActivitySocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers)
      for (const user of onlineUsers) {
        store.commit('chat/SET_USER_STATUS', { user: user.nickname, status: 'ONLINE' })
      }
    })

    this.socket.on('user:ONLINE', (user: User) => {
      console.log('User is online', user)
      store.commit('chat/SET_USER_STATUS', { user: user.nickname, status: 'ONLINE' })
    })

    this.socket.on('user:OFFLINE', (user: User) => {
      console.log('User is offline', user)
      store.commit('chat/SET_USER_STATUS', { user: user.nickname, status: 'OFFLINE' })
    })

    this.socket.on('user:DND', (user: User) => {
      console.log('User is dnd', user)
      store.commit('chat/SET_USER_STATUS', { user: user.nickname, status: 'DND' })
    })

    this.socket.on('newInvite', async (user: User, channel: Channel) => {
      console.log('new invite', user, channel)
      // ak je to adresovane mne
      if (user.id === store.state.auth.user!.id) {
        await store.dispatch('chat/showNewInviteAction', channel)
      }
    })

    this.socket.on('invitedUserJoined', (user: SerializedUser, channel:Channel) => {
      const userIsNotAlreadyInChannelUsersList = () => {
        for (const u of store.state.chat.users[channel.name]) {
          if (u.id === user.id) {
            return false
          }
        }
        return true
      }
      console.log('userJoined ACTIVITY SERVICE', user)
      // ak user co sa pripojil niesom ja
      // a som pripojeny v kanale do ktoreho sa pripojil
      // a zaroven ho tam uz nemam pridaneho
      const userThatJoinedChannelIsNotMe = user.id !== store.state.auth.user!.id
      const channelIsAmongMyChannels = channel.name in store.state.chat.users
      if (
        userThatJoinedChannelIsNotMe &&
        channelIsAmongMyChannels &&
        userIsNotAlreadyInChannelUsersList()
      ) {
        store.commit('chat/USER_JOINED', { channel: channel.name, user })
      }
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }

  public changeStatus (status: string): Promise<void> {
    return this.emitAsync('changeStatus', status)
  }

  public inviteUser (channel: string, user: string): Promise<any> {
    return this.emitAsync('inviteUser', channel, user)
  }
}

export default new ActivitySocketManager('/')
