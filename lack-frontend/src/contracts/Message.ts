import { User } from './Auth'

export interface SerializedMessage {
  content: string
  channelId: number,
  createdAt: string,
  updatedAt: string,
  id: number,
  author: User
}

export interface CurrentlyTypedMessage{
  content: string
  user: string
  channel: string
}
