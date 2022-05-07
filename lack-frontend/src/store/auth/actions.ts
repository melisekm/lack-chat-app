import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'
import { LoginCredentials, RegisterData } from 'src/contracts'
import { activityService, authManager, authService } from 'src/services'

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  setUserAction ({ commit }, payload) {
    commit('setUser', payload)
  },
  async setStatusAction ({ commit, dispatch, state, rootState }, payload) {
    const prevStatus = state.userStatus
    if (prevStatus === payload) {
      return
    }
    await activityService.changeStatus(payload)
    commit('SET_USER_STATUS', payload)
    if (payload === 'OFFLINE') {
      await dispatch('chat/leaveSockets', { channel: null, clearChannelData: false }, { root: true })
    } else if (prevStatus === 'OFFLINE') {
      await dispatch('chat/getUserChannels', rootState.chat.selectedChannel, { root: true })
    }
  },
  async check ({ commit }): Promise<boolean> {
    try {
      commit('AUTH_START')
      const user = await authService.me()
      commit('AUTH_SUCCESS', user)
      return user !== null
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async register ({ commit }, form: RegisterData) {
    try {
      commit('AUTH_START')
      const user = await authService.register(form)
      commit('AUTH_SUCCESS', null)
      return user
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async login ({ commit }, credentials: LoginCredentials) {
    try {
      commit('AUTH_START')
      const apiToken = await authService.login(credentials)
      commit('AUTH_SUCCESS', null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async logout ({ commit, dispatch }) {
    try {
      commit('AUTH_START')
      await authService.logout()
      await dispatch('chat/leaveSockets', { channel: null, clearChannelData: true }, { root: true })
      commit('chat/SET_USER_STATUSES', {}, { root: true })
      commit('AUTH_SUCCESS', null)
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      commit('AUTH_ERROR', err)
      console.log(err)
      throw err
    }
  }
}

export default actions
