import { MutationTree } from 'vuex'
import { ChatStateInterface } from 'src/store/chat/state'
import { Channel, SerializedMessage, SerializedUser } from 'src/contracts'

export const channelsMutations: MutationTree<ChatStateInterface> = {
  LOADING_START (state) {
    state.loading = true
    state.error = null
  },
  LOADING_ERROR (state, error) {
    state.loading = false
    state.error = error
  },
  // ked sa pripajam / prepinam channely, chcem nacitat aj spravy
  SET_CHANNEL_DATA (state, { channel, messages, users }: { channel: string, messages: SerializedMessage[], users: SerializedUser[] }) {
    state.loading = false
    state.messages[channel] = messages
    state.users[channel] = users
    state.currentlyTypedMessages[channel] = {}
  },
  // ked user leavne kanal
  CLEAR_CHANNEL (state, channel) {
    delete state.messages[channel]
    delete state.users[channel]
    state.channels = state.channels.filter(c => c.name !== channel)
  },
  SET_SELECTED_CHANNEL (state, channel: string) {
    state.selectedChannel = channel
  },
  SET_CHANNELS (state, channels: Channel[]) {
    state.channels = channels
  },
  NEW_CHANNEL (state, channel: Channel) {
    channel.joinedAt = new Date().toISOString()
    state.channels.push(channel)
  },
  SET_CHANNEL_JOINED_AT (state, channel) {
    const index = state.channels.findIndex(c => c.name === channel)
    if (index !== -1) {
      state.channels[index].joinedAt = new Date().toISOString()
    }
  },
  NEW_INVITE (state, channel: Channel) {
    state.channels.push(channel)
  },
  SET_USER_STATUSES (state, payload) {
    state.userStatus = payload
  },
  SET_USER_STATUS (state, { user, status }: { user: string, status: string }) {
    state.userStatus[user] = status
  },
  USER_JOINED (state, { channel, user }: { channel: string, user: SerializedUser }) {
    state.users[channel].push(user)
  },
  USER_LEFT (state, { channel, user }: { channel: string, user: SerializedUser }) {
    state.users[channel] = state.users[channel].filter(u => u.id !== user.id)
  }
}
