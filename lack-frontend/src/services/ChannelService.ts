import { Channel, CurrentlyTypedMessage, SerializedMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import { SerializedUser } from 'src/contracts/User'
import { getMessageNotification, getNegativeNotification } from 'src/utils'

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: SerializedMessage) => {
      // ukaz notifikaciu len ak som online a nie je to moja sprava
      const showNotificationAtAll = store.state.auth.userStatus === 'ONLINE' && message.author.id !== store.state.auth.user!.id
      if (showNotificationAtAll) {
        const showOnlyAddressedToMe = store.state.ui.showNotificationsAddressedToMe
        // ak to nemam nastavene tak ukaz, ak to mam nastavene pozri sa ci obsahuje moje meno
        const showNotification = !showOnlyAddressedToMe || message.content.includes(store.state.auth.user!.nickname)
        console.log(showNotification)
        if (showNotification) {
          getMessageNotification(message, channel)
        }
      }
      store.commit('chat/NEW_MESSAGE', { channel, message })
    })

    this.socket.on('userJoined', (user: SerializedUser) => {
      console.log('userJoined CHANNEL SERVICE', user)
      if (user.id !== store.state.auth.user!.id) {
        store.commit('chat/USER_JOINED', { channel, user })
      }
    })

    this.socket.on('userLeft', (user: SerializedUser) => {
      store.commit('chat/USER_LEFT', { channel, user })
    })

    this.socket.on('channelDeleted', async () => {
      getNegativeNotification(channel + ' was deleted.')
      await store.dispatch('chat/leaveChannelAction', { channel, emit: false })
    })

    this.socket.on('typing', (message: CurrentlyTypedMessage) => {
      store.commit('chat/SET_USER_CURRENTLY_TYPING', message)
    })

    this.socket.on('userKick', (user: SerializedUser) => {
      if (user.id === store.state.auth.user!.id) {
        console.log('userKick CHANNEL SERVICE', user, channel)
        getNegativeNotification('You were kicked from ' + channel)
        store.dispatch('chat/leaveChannelAction', { channel, emit: false })
      } else {
        console.log('somebody was kicked', user, channel)
        store.commit('chat/USER_LEFT', { channel, user })
      }
    })
  }

  public addMessage (message: string): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public joinChannel (channel: string): Promise<Channel> {
    return this.emitAsync('addUser', channel)
  }

  public leaveChannel (channel: string): Promise<Channel> {
    return this.emitAsync('removeUser', channel)
  }

  public deleteChannel (channel: string): Promise<void> {
    return this.emitAsync('deleteChannel', channel)
  }

  public typing (message: string): Promise<void> {
    return this.emitAsync('typing', message)
  }

  public kickUser (channel: string, user: string, isRevoke: boolean): Promise<any> {
    return this.emitAsync('kickUser', user, isRevoke)
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string) {
    if (this.channels.has(name)) {
      console.log(`User is already joined in channel "${name}"`)
      return
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
  }

  public select (name: string): ChannelSocketManager {
    if (!this.channels.has(name)) {
      throw new Error(`User is not joined in channel "${name}"`)
    }
    return this.channels.get(name)!
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }
}

export default new ChannelService()
