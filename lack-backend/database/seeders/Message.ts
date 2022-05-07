import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Message from 'App/Models/Message'

export default class MessageSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'content'

    const payload = [
      {
        createdBy: 1,
        channelId: 1,
        content: 'Hello World',
      },
      {
        createdBy: 2,
        channelId: 1,
        content: 'Hello Martin, how are you?',
      },
      {
        createdBy: 1,
        channelId: 1,
        content: 'I am fine, thank you.',
      },
      {
        createdBy: 2,
        channelId: 1,
        content: 'So where are you from?.',
      },
      {
        createdBy: 1,
        channelId: 1,
        content: 'I am From slovakia and you?.',
      },
      {
        createdBy: 2,
        channelId: 1,
        content: 'Oooh, I am from slovakia too! What about Ivan?.',
      },
      {
        createdBy: 3,
        channelId: 1,
        content: 'Hey everyone, I am from Germany.',
      },
      {
        createdBy: 3,
        channelId: 1,
        content:
          'We need around 15 - 20 messages' +
          ' so this is gonna be a long chain.',
      },
      {
        createdBy: 2,
        channelId: 1,
        content: 'No not really' + ' we can do this:',
      },
    ]
    for (let i = 0; i < 45; i++) {
      payload.push(generateRandomMessage(3, 1, i.toString()))
    }
    for (let i = 0; i < 45; i++) {
      payload.push(generateRandomMessage(2, 2, i.toString()))
    }

    await Message.updateOrCreateMany(uniqueKey, payload)
  }
}

const generateRandomMessage = (
  maxAuthorId: number,
  channelId: number,
  content?: string
) => {
  return {
    createdBy: getRandomInt(1, maxAuthorId),
    channelId: channelId,
    content:
      content ??
      `generated message ${getRandomInt(0, 100)} ${
        getRandomInt(0, 1) > 0.5 ? '@Martin' : ''
      } and also very long one`,
  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
