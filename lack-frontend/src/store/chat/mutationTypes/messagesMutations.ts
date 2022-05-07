import { MutationTree } from 'vuex'
import { ChatStateInterface } from 'src/store/chat/state'
import { CurrentlyTypedMessage, SerializedMessage } from 'src/contracts'

export const messagesMutations: MutationTree<ChatStateInterface> = {
  NEW_MESSAGE (state, { channel, message }: { channel: string, message: SerializedMessage }) {
    state.messages[channel].push(message)
  },
  PREPEND_MESSAGES (state, messages: SerializedMessage[]) {
    state.messages[state.selectedChannel!] = messages.concat(state.messages[state.selectedChannel!])
  },
  SET_USER_CURRENTLY_TYPING (state, message: CurrentlyTypedMessage) {
    state.currentlyTypedMessages[message.channel][message.user] = message.content
  }
}
