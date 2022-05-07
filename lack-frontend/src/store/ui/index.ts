import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { UiStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const interfaceModule: Module<UiStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default interfaceModule
