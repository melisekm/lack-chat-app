<template>
  <q-toolbar class="q-py-md bg-dark">

    <q-input class="full-width text-white"
             v-model="newMessage"
             autogrow outlined dark
             input-style="max-height: 8em"
             bg-color="dark"
             @keydown.enter.exact.prevent="sendMessage"
             @keydown.enter.shift.exact.prevent="newMessage += '\n'"
             :placeholder="`message #${trimString(selectedChannel,15)}`">
      <template v-slot:after>
        <q-btn
          class="sendButton"
          @mousedown.prevent @click="sendMessage"
          round dense flat
          color="white"
          icon="send"/>
      </template>
    </q-input>

  </q-toolbar>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { getNegativeNotification, trimString } from 'src/utils'
import { useStore } from 'src/store'
import { channelService } from 'src/services'

export default defineComponent({
  name: 'MessageInputBar',
  setup () {
    const store = useStore()
    const newMessage = ref('')
    const selectedChannel = computed(() => store.state.chat.selectedChannel)
    const loading = ref(false)

    onMounted(() => {
      const sendButton = document.getElementsByClassName('sendButton')[0]
      const elements = sendButton.getElementsByClassName('q-focus-helper')
      // Important
      // removes focus helper from send btn, because when you tap it on mobile, it autofocuses and hides keyboard
      Array.from(elements).forEach(element => {
        element.remove()
      })
    })

    watch(() => newMessage.value, async () => {
      await channelService.in(selectedChannel.value!)?.typing(newMessage.value)
    })

    // on selectedChannel change, scroll to bottom
    store.watch((state) => state.chat.selectedChannel, () => {
      newMessage.value = ''
      void store.dispatch('ui/scrollToBottom', false)
    })

    const sendMessage = () => {
      if (!newMessage.value || newMessage.value.trim() === '') {
        return
      }
      loading.value = true
      store.dispatch('chat/addMessage', { channel: selectedChannel.value, message: newMessage.value })
        .then(() => {
          newMessage.value = ''
        })
        .catch((e) => {
          console.log(e)
          getNegativeNotification('There was an error sending the message')
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      newMessage,
      selectedChannel,
      loading,
      sendMessage,
      trimString
    }
  }
})
</script>
