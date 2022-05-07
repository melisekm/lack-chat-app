import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default class MessageRepository implements MessageRepositoryContract {
  public async findAllByChannel(
    channel: Channel,
    page: number = 1,
    beforeDate: Date = new Date(),
    limit: number = 20
  ): Promise<ModelPaginatorContract<Message>> {
    return await Message.query()
      .where('channel_id', channel.id)
      .andWhere('created_at', '<=', beforeDate)
      .preload('author')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  public async create(
    channelName: string,
    userId: number,
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = await channel
      .related('messages')
      .create({ createdBy: userId, content })
    await message.load('author')

    return message.serialize() as SerializedMessage
  }
}
