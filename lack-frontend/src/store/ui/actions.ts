import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UiStateInterface } from './state'

const actions: ActionTree<UiStateInterface, StateInterface> = {
// payload: behavior of scroll down, if true 'smooth' else 'auto' (instant)
  scrollToBottom (context, payload = true) {
    const scrollArea = document.querySelector<HTMLElement>('.q-scrollarea__container')
    if (scrollArea) {
      setTimeout(() => {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: payload ? 'smooth' : 'auto'
        })
      }, 10)
    }
  }
}

export default actions
