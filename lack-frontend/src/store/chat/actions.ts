import { channelsActions } from 'src/store/chat/actionTypes/channelsActions'
import { messagesActions } from 'src/store/chat/actionTypes/messagesActions'

export default {
  ...channelsActions,
  ...messagesActions
}
