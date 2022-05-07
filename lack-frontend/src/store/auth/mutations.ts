import { MutationTree } from 'vuex'
import { AuthStateInterface } from './state'
import { User } from 'src/contracts'

const mutation: MutationTree<AuthStateInterface> = {
  SET_USER_STATUS (state: AuthStateInterface, payload) {
    state.userStatus = payload
  },

  AUTH_START (state) {
    state.status = 'pending'
    state.errors = []
  },
  AUTH_SUCCESS (state, user: User | null) {
    state.status = 'success'
    state.user = user
  },
  AUTH_ERROR (state, errors: { message: string, field?: string }[]) {
    state.status = 'error'
    state.errors = errors
  }
}

export default mutation
