// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
declare module '@ioc:Repositories/MessageRepository' {
  import { LucidModel, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
  import User from 'App/Models/User'
  import Channel from 'App/Models/Channel'
  import Message from 'App/Models/Message'

  export interface SerializedMessage {
    createdBy: number
    content: string
    channelId: number
    createdAt: string
    updatedAt: string
    id: number
    author: {
      id: number
      email: string
      createdAt: string
      updatedAt: string
    }
  }

  export interface MessageRepositoryContract {
    findAllByChannel(
      channel: Channel,
      page: number,
      beforeDate?: Date,
      limit?: number
    ): Promise<ModelPaginatorContract<Message>>
    create(
      channelName: string,
      userId: number,
      content: string
    ): Promise<SerializedMessage>
  }

  export const MessageRepository: MessageRepositoryContract
}

declare module '@ioc:Repositories/UserRepository' {
  import User from 'App/Models/User'

  export interface UserRepositoryContract {
    findByNickname(name: string): Promise<User | null>
  }

  export const UserRepository: UserRepositoryContract
}

declare module '@ioc:Repositories/ChannelRepository' {
  import User from 'App/Models/User'
  import Channel from 'App/Models/Channel'

  export interface SerializedChannel {
    id: number
    name: string
    joinedAt: string
  }

  export interface ChannelRepositoryContract {
    findByName(channelName: string): Promise<Channel>
    findByUser(user: User): Promise<SerializedChannel[]>
    create(user: User, isPublic: boolean, channelName: string): Promise<Channel>
    updateJoinedAt(user: User, channel: Channel): Promise<void>
    attachUser(user: User, channel: Channel): Promise<void>
    detachUser(user: User, channel: Channel): Promise<void>
    deleteByName(channelName: string): Promise<void>
    delete(channel: Channel): Promise<void>
  }

  export const ChannelRepository: ChannelRepositoryContract
}

declare module '@ioc:Repositories/KickRepository' {
  import Kick from 'App/Models/Kick'

  export interface KickRepositoryContract {
    findByTriple(
      kickerId: number,
      userId: number,
      channelId: number
    ): Promise<Kick | null>
    create(kickerId: number, userId: number, channelId: number): Promise<Kick>
    countUserKicks(userId: number, channelId: number): Promise<number>
    deleteAllByUserIdAndChannelId(
      userId: number,
      channelId: number
    ): Promise<void>
  }

  export const KickRepository: KickRepositoryContract
}
