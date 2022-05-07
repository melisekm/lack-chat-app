<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center q-pb-none">

        <div class="text-h6 q-my-md">Join channel</div>
        <q-space/>
        <q-btn icon="close" @click="onCancelClick" flat round dense/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          autofocus
          filled
          v-model="channelName"
          label="Channel name *"
          lazy-rules
          @keydown.exact.enter="onOKClick"
          :rules="[ val => val && val.trim().length > 0 && val.trim().length < 255 || 'Please type something']"
        />
        <div class="q-gutter-sm q-mt-sm">
          <q-radio v-model="publicity" val="public" label="Public"/>
          <q-radio v-model="publicity" val="private" label="Private"/>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="onCancelClick"/>
        <q-btn flat label="Join channel" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useStore } from 'src/store'
import { getNegativeNotification } from 'src/utils'

export default defineComponent({
  name: 'CreateChannelDialog',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup () {
    const store = useStore()
    const channelName = ref('')
    const publicity = ref('public')
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    return {
      publicity,
      dialogRef,
      onDialogHide,
      onOKClick () {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        if (!channelName.value || channelName.value.trim().length === 0) {
          return
        }
        store.dispatch('chat/handleCommandAction', `/join ${channelName.value} ${publicity.value}`)
          .then(() => {
            onDialogOK()
          })
          .catch((e) => {
            console.log(e)
            getNegativeNotification('Error creating channel')
          })
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },
      onCancelClick: onDialogCancel,
      channelName
    }
  }
})
</script>
