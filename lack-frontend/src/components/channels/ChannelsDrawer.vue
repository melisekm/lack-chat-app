<template>
  <q-drawer v-model="drawerOpen" class="bg-dark text-white" side="left" show-if-above elevated :breakpoint=768>
    <q-list>
      <q-item-label header class="text-white"> Channels</q-item-label>
      <div class="row q-my-sm justify-center">
        <q-btn
          label="Join Channel"
          color="primary"
          @click="showCreateChannelDialog"
        />
      </div>
      <ChannelItem
        v-for="channel in userChannels.invitedChannels"
        :key="channel.id"
        :channel="channel"
        invited
      />
      <q-separator/>
      <ChannelItem
        v-for="channel in userChannels.nonInvitedChannels"
        :key="channel.id"
        :channel="channel"
      />
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ChannelItem from 'components/channels/ChannelItem.vue'
import { useStore } from 'src/store'
import { useQuasar } from 'quasar'
import CreateChannelDialog from 'components/channels/CreateChannelDialog.vue'

export default defineComponent({
  name: 'ChannelsDrawer',
  components: { ChannelItem },
  setup () {
    const $q = useQuasar()
    const store = useStore()
    const userChannels = computed(() => store.getters['chat/drawerChannels'])
    const drawerOpen = computed(({
      get: () => store.state.ui.leftDrawerState,
      set: (val) => store.commit('ui/setLeftDrawerState', val)
    }))

    const showCreateChannelDialog = () => {
      $q.dialog({
        component: CreateChannelDialog,

        // props forwarded to your custom component
        componentProps: {
          // ...more..props...
        }
      }).onOk(() => {
        if ($q.screen.width < 768) {
          store.commit('ui/setLeftDrawerState', false)
        }
      })
    }
    return {
      userChannels,
      drawerOpen,
      showCreateChannelDialog
    }
  }
})
</script>

<style scoped>

</style>
