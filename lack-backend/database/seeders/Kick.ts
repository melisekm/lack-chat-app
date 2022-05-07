import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Kick from 'App/Models/Kick'
import { DateTime } from 'luxon'

export default class KickSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const uniqueKey = 'createdAt'
    const payload = [
      {
        userId: 1,
        kickerId: 2,
        channelId: 3,
        createdAt: DateTime.utc(),
      },
      {
        userId: 1,
        kickerId: 4,
        channelId: 3,
        createdAt: DateTime.utc(),
      },
      {
        userId: 1,
        kickerId: 5,
        channelId: 3,
        createdAt: DateTime.utc(),
      },
      {
        userId: 4,
        kickerId: 5,
        channelId: 3,
        createdAt: DateTime.utc(),
      },
    ]
    await Kick.updateOrCreateMany(uniqueKey, payload)
  }
}
