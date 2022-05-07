import { Channel, SerializedMessage } from 'src/contracts'
import { SerializedUser } from 'src/contracts/User'

export interface ChatStateInterface {
  loading: boolean,
  error: Error | null,
  messages: { [channel: string]: SerializedMessage[] }
  users: { [channel: string]: SerializedUser[] }
  selectedChannel: string | null
  channels: Channel[]
  userStatus: { [username: string]: string},
  hasMorePages: boolean,
  page: number,
  paginationBeforeDate: Date,
  currentlyTypedMessages: { [channel: string]: {[user:string]: string} },
}

function state (): ChatStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    selectedChannel: null,
    users: {},
    channels: [],
    userStatus: {},
    hasMorePages: false,
    page: 1,
    paginationBeforeDate: new Date(),
    currentlyTypedMessages: {}
  }
}

export default state
