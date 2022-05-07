import { ChatStateInterface } from 'src/store/chat/state'
import { api } from 'src/boot/axios'
import { AxiosResponse } from 'axios'
import { activityService, channelService } from 'src/services'
import { dummyChannel } from 'src/utils/index'

export class ValidationException extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ValidationException'
  }
}

const parseJoinArgs = (args: string[]) => {
  let channelName = checkFirstArg(args, 'Please specify a channel name.')
  let publicity = 'public'

  // it is a multi-word command
  if (args.length > 1) {
    // Check if last argument is a valid publicity
    if (args[args.length - 1] === 'public' || args[args.length - 1] === 'private') {
      // if yes set publicity to the last argument and remove it from the args
      publicity = args.pop()!
    }
    // join the rest of the args as the channel name
    channelName = args.join('-')
  }
  return [channelName, publicity]
}

export const handleJoin = async (state: ChatStateInterface, args: string[]) => {
  const [channelName, publicity] = parseJoinArgs(args)
  const response = (await api.get(`/channels/${channelName}/check`)).data
  if (response) {
    if ('error' in response) {
      throw new ValidationException(response.error)
    }
    if ('success' in response) {
      if (response.channel) {
        return {
          message: 'Successfully joined channel ' + channelName,
          channel: response.channel,
          newChannel: false
        }
      }
      return {
        message: 'Successfully created channel ' + channelName,
        channel: {
          name: channelName,
          public: publicity === 'public'
        },
        newChannel: true
      }
    }
  }
  throw new Error('Something went wrong. Please try again.')
}

export const handleCancel = (activeChannel: string | null, args: string[]): string => {
  if (!activeChannel || activeChannel === dummyChannel.name) {
    throw new ValidationException('You are not in a channel.')
  }
  return args.length === 0 ? activeChannel : args[0]
}

export const handleQuit = async (state: ChatStateInterface, args: string[]) => {
  const activeChannel = args.length === 0 ? state.selectedChannel : args[0]
  if (!activeChannel || activeChannel === dummyChannel.name) {
    throw new ValidationException('You are not in a channel.')
  }
  const isAdmin = await api.get(`/channels/${activeChannel}/admin`)
    .then((response: AxiosResponse<boolean>) => {
      return response.data
    })
    .catch((err) => {
      console.error(err)
      return false
    })
  if (!isAdmin) {
    throw new ValidationException('You are not an admin of this channel.')
  }
  return activeChannel
}

export const handleInvite = async (state: ChatStateInterface, args: string[]) => {
  const nickNameToBeInvited = checkFirstArg(args, 'Please specify user nickname.')
  const response = await activityService.inviteUser(state.selectedChannel!, nickNameToBeInvited)
  if (response) {
    if ('error' in response) {
      throw new ValidationException(response.error)
    }
    if ('success' in response) {
      return { message: 'Successfully invited user ' + nickNameToBeInvited }
    }
  }
  throw new Error('Something went wrong while inviting user.')
}

// toto je instant ban ak to da spravca, a iba kick ak user a revoke
export const handleKick = async (state: ChatStateInterface, args: string[], isRevoke:boolean) => {
  const nickNameToBeKicked = checkFirstArg(args, 'Please specify user name.')
  const response = await channelService.in(state.selectedChannel!)?.kickUser(state.selectedChannel!, nickNameToBeKicked, isRevoke)
  if (response) {
    if ('error' in response) {
      throw new ValidationException(response.error)
    }
    if ('success' in response) {
      return { message: 'Successfully kicked user ' + nickNameToBeKicked }
    }
  }
  throw new Error('Something went wrong while kicking user.')
}

const checkFirstArg = (args: string[], errMsg: string) => {
  if (args.length === 0) {
    throw new ValidationException(errMsg)
  }
  const firstArg = args[0].trim()
  if (firstArg.length === 0) {
    throw new ValidationException(errMsg)
  }
  return firstArg
}
