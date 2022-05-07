import { MutationTree } from 'vuex'
import { UiStateInterface } from './state'

const mutation: MutationTree<UiStateInterface> = {
  setLeftDrawerState (state: UiStateInterface, payload: boolean) {
    state.leftDrawerState = payload
  },
  setRightDrawerState (state: UiStateInterface, payload: boolean) {
    state.rightDrawerState = payload
  },
  toggleLeftDrawer (state: UiStateInterface) {
    state.leftDrawerState = !state.leftDrawerState
  },
  toggleRightDrawer (state: UiStateInterface) {
    state.rightDrawerState = !state.rightDrawerState
  },
  setShowNotificationsAddressedToMe (state: UiStateInterface, payload: boolean) {
    state.showNotificationsAddressedToMe = payload
  }
}

export default mutation
