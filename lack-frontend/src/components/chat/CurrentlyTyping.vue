<template>
  <q-banner class="text-white bg-grey-7" dense>
    <span v-if="currentlyTypedMessages.length === 0">No one is typing.</span>
    <span v-else>
      <span
        v-for="([user,content],index) of currentlyTypedMessages"
        :key="user">
        <template v-if="content.length > 0">
          <span class="link" @click="openMessageDialog(user)">
            {{ user }}
          </span>
          <span v-if="index !== currentlyTypedMessages.length - 1">, </span>
        </template>
      </span>
    <span v-if="currentlyTypedMessages.length > 1"> are </span> <span v-else> is </span> typing...
    </span>
  </q-banner>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'src/store'
import ViewMessageDialog from 'components/chat/ViewCurrentlyTypedMessageDialog.vue'

export default defineComponent({
  name: 'CurrentlyTyping',
  setup () {
    const $q = useQuasar()
    const store = useStore()
    const currentlyTypedMessages =
      computed(() => store.getters['chat/currentlyTypedMessages'])

    const openMessageDialog = (user: string) => {
      $q.dialog({
        component: ViewMessageDialog,
        componentProps: {
          user
        }
      })
    }
    return {
      openMessageDialog,
      currentlyTypedMessages
    }
  }
})
</script>
