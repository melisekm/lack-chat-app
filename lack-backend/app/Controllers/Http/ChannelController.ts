// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/core/build/standalone'
import { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepository'
import { KickRepositoryContract } from '@ioc:Repositories/KickRepository'
import { checkForErrors } from 'App/Helpers'

@inject(['Repositories/ChannelRepository', 'Repositories/KickRepository'])
export default class ChannelController {
  constructor(
    private channelRepository: ChannelRepositoryContract,
    private kickRepository: KickRepositoryContract
  ) {}

  // find all currently logged in user's channels
  public async getUserChannels({ auth }: HttpContextContract) {
    return await this.channelRepository.findByUser(auth.user!)
  }

  public async getChannel({ params, response }: HttpContextContract) {
    try {
      return await this.channelRepository.findByName(params.name)
    } catch (e) {
      return response.status(200).send({
        msg: e.message,
      })
    }
  }

  public async tryToJoinChannel({ params, auth }: HttpContextContract) {
    let channel
    try {
      channel = await this.channelRepository.findByName(params.name)
    } catch (e) {
      // new channel will be created
      return {
        success: true,
        channel: null,
      }
    }
    const user = auth.user!
    const error = checkForErrors(
      {
        channelShouldBePublic: true,
        userShouldNotBeInChannel: true,
      },
      { channel, user }
    )
    if (error) {
      return { error: error }
    }

    const kickCount = await this.kickRepository.countUserKicks(
      user.id,
      channel.id
    )
    if (kickCount > 2) {
      return {
        error: 'You are banned from this channel',
      }
    }
    // return existing channel
    return {
      success: true,
      channel,
    }
  }

  public async acceptInvite({ params, auth }: HttpContextContract) {
    const channel = await this.channelRepository.findByName(params.name)
    return await this.channelRepository.updateJoinedAt(auth.user!, channel)
  }

  public async createChannel({ request, auth, response }: HttpContextContract) {
    const body = request.all()
    try {
      const channel = await this.channelRepository.create(
        auth.user!,
        body.public,
        body.name
      )
      await channel.load('messages')
      await channel.load('users')
      await this.channelRepository.updateJoinedAt(auth.user!, channel)
      return channel
    } catch (e) {
      return response.status(200).send({
        msg: e.message,
      })
    }
  }

  public async checkIfUserIsAdmin({ params, auth }: HttpContextContract) {
    const channel = await this.channelRepository.findByName(params.name)
    return channel.adminId === auth.user!.id
  }
}
