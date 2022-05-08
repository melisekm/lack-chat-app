import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    const payload = [
      {
        name: 'general',
        adminId: 1,
        isPublic: true,
      },
      {
        name: 'hidden',
        adminId: 2,
        isPublic: false,
      },
      {
        name: 'test',
        adminId: 2,
        isPublic: true,
      },
    ]

    const setChannels = (channelIds: number[]) => {
      const channels = {}
      channelIds.forEach((channelId) => {
        channels[channelId] = {
          joined_at: new Date(),
        }
      })
      return channels
    }

    await Channel.updateOrCreateMany(uniqueKey, payload)
    let users = await User.query().orderBy('id')
    await users[0].related('channels').attach(setChannels([1, 2]))
    await users[1].related('channels').attach(setChannels([1, 2, 3]))
    await users[2].related('channels').attach(setChannels([2]))
    await users[3].related('channels').attach(setChannels([1]))
  }
}
