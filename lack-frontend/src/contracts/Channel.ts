import { SerializedMessage } from 'src/contracts/Message'
import { SerializedUser } from 'src/contracts/User'

export interface Channel{
  id: number,
  name: string,
  isPublic:boolean,
  joinedAt:string|null,
  adminId:number,
}

export interface ChannelResponse extends Channel {
  messages: SerializedMessage[],
  users: SerializedUser[]
}
