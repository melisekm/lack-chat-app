import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'
import Ws from '@ioc:Ruby184/Socket.IO/Ws'

const channelActivityCheck = async () => {
  console.log('Checking if channels are active.')
  const channels = await Channel.query()
  for (let channel of channels) {
    const latestMessage = await Message.query()
      .where('channel_id', channel.id)
      .orderBy('created_at', 'desc')
      .first()
    let latestDate = channel.createdAt
    if (latestMessage !== null) {
      latestDate = latestMessage.createdAt
    }
    const diff = Math.abs(latestDate.diffNow(['days']).days)
    if (diff > 30) {
      console.log(channel.name, 'is inactive. Deleting')
      const nsp = Ws.io.of(`channels/${channel.name}`)
      await channel.delete()
      nsp.emit('channelDeleted', channel.name)
    }
  }
}

const schedule = require('node-schedule')
schedule.scheduleJob('0 1 * * *', channelActivityCheck)
void channelActivityCheck()
