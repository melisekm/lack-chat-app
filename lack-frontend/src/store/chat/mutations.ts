import { channelsMutations } from 'src/store/chat/mutationTypes/channelsMutations'
import { messagesMutations } from 'src/store/chat/mutationTypes/messagesMutations'
import { paginationMutations } from 'src/store/chat/mutationTypes/paginationMutations'

export default {
  ...channelsMutations,
  ...messagesMutations,
  ...paginationMutations
}
