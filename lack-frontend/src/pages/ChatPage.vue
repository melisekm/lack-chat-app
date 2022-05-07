<template>
  <q-page>
    <div class="row no-wrap full-width" style="min-height:inherit">
      <div class="col">
        <div class="column full-height ">
          <ChatArea/>
          <q-footer dark elevated>
            <CurrentlyTyping/>
            <MessageInputBar/>
          </q-footer>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import CurrentlyTyping from 'components/chat/CurrentlyTyping.vue'
import MessageInputBar from 'components/chat/MessageInputBar.vue'
import ChatArea from 'components/chat/ChatArea.vue'
import { useStore } from 'src/store'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ChatPage',
  components: { ChatArea, MessageInputBar, CurrentlyTyping },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    onMounted(async () => {
      const routeName = route.params.name as string
      console.log('route name', routeName)
      const success = await store.dispatch('chat/getUserChannels', routeName)
      if (!success) {
        console.log('failed to get channels, pushing 404')
        await router.push({ path: '/404' })
      }
    })

    store.watch(
      () => store.state.chat.selectedChannel,
      (name) => {
        router.push({
          path: `/channels/${name}`
        }).catch((e) => {
          console.log(e)
        })
      }
    )
    return {}
  }
})
</script>
