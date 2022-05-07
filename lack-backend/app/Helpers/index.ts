import Channel from 'App/Models/Channel'
import User from 'App/Models/User'

export const isUserInChannel = (
  channel: Channel,
  userToFind: User
): User | undefined => {
  return channel.users.find((user) => user.id === userToFind.id)
}

export const checkForErrors = (params, args) => {
  const channel = args.channel
  const user = args.user
  if (params.channelShouldBePublic) {
    if (!channel.isPublic) {
      return 'Channel is not public'
    }
  }

  if (params.channelShouldExist) {
    if (!channel) {
      return 'Channel not found.'
    }
  }
  if (params.userShouldExist) {
    if (!user) {
      return 'User not found.'
    }
  }

  if (params.userShouldNotBeInChannel) {
    if (isUserInChannel(channel, user)) {
      return 'User is already in channel.'
    }
  }
  if (params.userShouldBeInChannel) {
    if (!isUserInChannel(channel, user)) {
      return 'User is not in channel.'
    }
  }

  if (params.userShouldBeAdmin) {
    if (channel.adminId !== user.id) {
      return 'User is not admin.'
    }
  }

  return null
}
