import { ActionTree } from 'vuex'
import { StateInterface } from 'src/store'
import { ChatStateInterface } from 'src/store/chat/state'
import { dummyChannel, getNegativeNotification, getPositiveNotification, openConfirmDialog } from 'src/utils'
import { channelService } from 'src/services'
import {
  handleCancel,
  handleInvite,
  handleJoin,
  handleKick,
  handleQuit,
  ValidationException
} from 'src/utils/commandHandling'
import { api } from 'boot/axios'

export const messagesActions: ActionTree<ChatStateInterface, StateInterface> = {
  async addMessage ({ commit, dispatch, rootState }, { channel, message }: { channel: string, message: string }) {
    console.log('addMessage', channel, message)
    const isCommand = message.startsWith('/')
    if (isCommand) {
      return dispatch('handleCommandAction', message)
    }
    if (channel === dummyChannel.name) {
      getNegativeNotification('You are not in any channel. Please /join a channel first.')
      return
    }
    if (rootState.auth.userStatus === 'OFFLINE') {
      getNegativeNotification('You are offline and cannot send messages.')
      return
    }
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  },
  async handleCommandAction ({ state, commit, dispatch }, message: string) {
    // remove excessive whitespace - https://stackoverflow.com/a/14053282/12348001
    message = message.replace(/\s{2,}/g, ' ').trim()
    console.log('handleCommandAction', message)
    const command = message.substring(1)
    const commandParts = command.split(' ')
    const commandName = commandParts[0]
    const commandArguments = commandParts.slice(1)
    try {
      switch (commandName) {
        case 'join': {
          const result = await handleJoin(state, commandArguments)
          if (result.newChannel) {
            await dispatch('createChannelAction', result.channel)
          } else {
            await dispatch('joinChannelAction', result.channel)
          }
          getPositiveNotification(result.message)
          break
        }
        case 'invite':{
          // ak mal userToBeInvited ban, a invite dal spravca, treba mu zrusit ban
          const result = await handleInvite(state, commandArguments)
          getPositiveNotification(result.message)
          break
        }
        case 'revoke': {
          // revoke je kick ale nie ban a moze to dat iba admin.
          const result = await handleKick(state, commandArguments, true)
          getPositiveNotification(result.message)
          break
        }
        case 'kick':{
          // ak to dal spravca, treba userToBeKicked zabanovat
          const result = await handleKick(state, commandArguments, false)
          getPositiveNotification(result.message)
          break
        }
        case 'quit': {
          const channelToDelete = await handleQuit(state, commandArguments)
          openConfirmDialog(
            `Are you sure you want to delete ${channelToDelete}?`,
            async () => {
              console.log('deleteChannelAction', channelToDelete)
              await channelService.in(channelToDelete)?.deleteChannel(channelToDelete)
            })
          break
        }
        case 'cancel':{
          const channelToLeave = handleCancel(state.selectedChannel, commandArguments) as string
          openConfirmDialog(
            `Are you sure you want to leave ${channelToLeave}?`,
            async () => {
              await dispatch('leaveChannelAction', { channel: channelToLeave, emit: true })
              getPositiveNotification(channelToLeave + ' successfully left.')
            })
          break
        }
        case 'list':
          commit('ui/setRightDrawerState', true, { root: true })
          break
        default:
          getNegativeNotification('Unrecognized command')
      }
    } catch (e) {
      if (e instanceof ValidationException) {
        getNegativeNotification(e.message)
      } else {
        console.log(e)
        getNegativeNotification('Something went wrong. :(')
      }
    }
  },

  async loadMoreMessagesAction ({ state, commit }) {
    console.log('pagination started', state.page)
    const msgPagination = await api.get(
      `/channels/${state.selectedChannel!}/messages?` +
      `page=${state.page}&` +
      `date=${state.paginationBeforeDate.toISOString()}`
    )
      .then((response) => response.data)
    // reverse lebo ich getujeme ako 8 7 6 5 4 ale v scroll area zobrazujeme 4 5 6 7 8
    const messages = msgPagination.data.reverse()
    const msgMeta = msgPagination.meta
    console.log(messages, msgMeta, state.page)
    commit('SET_HAS_MORE_PAGES', msgMeta.next_page_url != null)
    commit('INCREMENT_PAGE')
    commit('PREPEND_MESSAGES', messages)
  }
}
