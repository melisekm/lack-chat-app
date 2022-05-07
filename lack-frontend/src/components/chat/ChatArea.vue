<template>
  <q-scroll-area ref="scrollAreaRef" class="col bg-dark column text-white" debounce="500">
    <q-infinite-scroll @load="onInfinityScrollLoad" reverse debounce="500">
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="blue" name="dots" size="40px"/>
        </div>
      </template>
      <div class="q-pa-md">
        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          :name="message.author.nickname"
          :text="[message.content]"
          :sent="message.author?.id === user.id"
          :stamp="formatDate(message.createdAt)"
          class="q-mx-md"
          text-color="white"
          :bg-color="getBgColor(user, message)"
          style="white-space: pre-wrap;"
        />
      </div>
    </q-infinite-scroll>
  </q-scroll-area>
  <q-inner-loading
    dark
    :showing="channelLoading"
    label="Loading..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { absDifference, formatDate, getNegativeNotification } from 'src/utils'
import { useStore } from 'src/store'
import { debounce, QScrollArea } from 'quasar'
import { SerializedMessage, User } from 'src/contracts'

export default defineComponent({
  name: 'ChatArea',
  setup () {
    const store = useStore()
    const messages = computed(() => store.getters['chat/currentMessages'])
    const user = computed(() => store.state.auth.user)
    const scrollAreaRef = ref<QScrollArea | null>(null)
    const hasMoreMessages = computed(() => store.state.chat.hasMorePages)
    const channelLoading = computed(() => store.state.chat.loading)

    const getBgColor = (user:User, message:SerializedMessage) => {
      if (message.content.includes('@' + user.nickname)) {
        return 'lime-10'
      }
      if (message.author.id === user.id) {
        return 'grey-14'
      }
      return 'blue-grey-7'
    }

    onMounted(() => {
      void store.dispatch('ui/scrollToBottom')
      // when website is resized or virtual mobile keyboard opens we scroll to bottom, we check for this every 200ms
      window.addEventListener('resize', debounce(() => {
        void store.dispatch('ui/scrollToBottom', false)
      }, 200 /* ms to wait */)
      )
    })
    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        void store.dispatch('ui/scrollToBottom', false)
      })
    })

    watch(() => messages.value, () => {
      // https://stackoverflow.com/a/68238764/12348001
      if (scrollAreaRef.value) {
        const el = scrollAreaRef.value.getScrollTarget()
        const isAtBottom = absDifference((el.scrollTop + el.clientHeight), (el.scrollHeight)) < 120
        if (isAtBottom) {
          void store.dispatch('ui/scrollToBottom')
        }
      }
    }, {
      deep: true,
      immediate: true
    })
    const onInfinityScrollLoad = (index: number, done: () => void) => {
      // ak neexistuju spravy tak nic nenacitavaj, nacita si tie prvotne sam na zaciatku
      if (!messages.value || messages.value.length < 20 || !hasMoreMessages.value) {
        done()
        return
      }
      store.dispatch('chat/loadMoreMessagesAction')
        .then(() => {
          done()
        })
        .catch((e) => {
          console.log(e)
          getNegativeNotification('There was an error loading more messages!')
          done()
        })
    }
    return {
      messages,
      user,
      onInfinityScrollLoad,
      scrollAreaRef,
      getBgColor,
      formatDate,
      channelLoading
    }
  }
})
</script>

<style>
.q-scrollarea__content {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}
</style>
