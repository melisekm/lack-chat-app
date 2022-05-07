<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="max-width: 1000px;width:600px">
      <q-card-section>
        <div class="text-h6"><span class="text-bold">{{ user }}</span> is currently typing</div>
      </q-card-section>
      <q-separator/>
      <q-card-section style="max-height: 50vh" class="scroll">
        <p>
          {{message}}
        </p>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" @click="onCancelClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { computed, defineComponent } from 'vue'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'ViewMessageDialog',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
    const message = computed(() => {
      // realtime mesnime message vo vnutri tohto okna, tak ako sa nam meni ked prichadzaju spravy cez socket
      // active musi byt setnute a musi existovat v hlavnom objekte curr typed msgs
      if (store.state.chat.selectedChannel &&
        store.state.chat.selectedChannel in store.state.chat.currentlyTypedMessages
      ) {
        return store.state.chat.currentlyTypedMessages[store.state.chat.selectedChannel][props.user]
      }
      return ''
    })
    return {
      message,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel
    }
  }
})
</script>
