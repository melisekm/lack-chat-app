import { MutationTree } from 'vuex'
import { ChatStateInterface } from 'src/store/chat/state'

export const paginationMutations: MutationTree<ChatStateInterface> = {
  SET_HAS_MORE_PAGES (state, hasMorePages: boolean) {
    state.hasMorePages = hasMorePages
  },
  INCREMENT_PAGE (state) {
    state.page++
  },
  RESET_PAGE (state) {
    state.page = 2
    // musime resetnut  maximalny cas sprav ktore budeme nacitavat pri infinite loadingu
    // inak by to zobrazovalo spravy ktore sme uz nacitali/poslali
    state.paginationBeforeDate = new Date()
  }
}
