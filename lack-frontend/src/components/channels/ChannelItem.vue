<template>
  <q-item clickable :active="active" :class="invited ? 'bg-indigo-7' : ''">
    <q-item-section avatar>
      <q-icon name="tag"/>
    </q-item-section>

    <q-item-section @click="selectChannel()">
      <div class="row  fit items-center">
        <div :class="invited ? 'col-7' : 'col'">
          <q-item-label lines="1">{{ channel.name }}</q-item-label>
          <q-item-label class="text-white" caption>
            {{ channel.isPublic ? 'public' : 'private' }}
          </q-item-label>
        </div>
        <div v-if="invited" class="col text-right">
          <q-item-label>INVITATION</q-item-label>
        </div>
      </div>
    </q-item-section>

    <q-item-section side v-if="!invited">
      <q-item-label>
        <q-btn-dropdown flat rounded dense dropdown-icon="more_vert">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section @click="openLeaveChannelDialog">
                <q-item-label>Leave</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="isUserAdmin" class="bg-red text-white" clickable v-close-popup>
              <q-item-section @click="openDeleteChannelDialog">
                <q-item-label>Delete</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item-label>
    </q-item-section>

  </q-item>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'src/store'
import { useQuasar } from 'quasar'
import { Channel } from 'src/contracts'

export default defineComponent({
  name: 'ChannelItem',
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true
    },
    invited: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const $q = useQuasar()
    const store = useStore()

    // if selected channel name is equal to name from props, set active to true
    const active = computed(() => {
      const selectedChannel = store.state.chat.selectedChannel
      return selectedChannel ? selectedChannel === props.channel.name : false
    })
    // if current user is admin of channel
    const isUserAdmin = computed(() => {
      const user = store.state.auth.user
      return props.channel.adminId === user?.id
    })

    const selectChannel = async () => {
      if ($q.screen.width < 768) {
        store.commit('ui/toggleLeftDrawer')
      }
      await store.dispatch('chat/selectChannel', props.channel.name)
    }

    const openLeaveChannelDialog = async () => {
      await store.dispatch('chat/addMessage', {
        channel: store.state.chat.selectedChannel,
        message: `/cancel ${props.channel.name}`
      })
    }

    const openDeleteChannelDialog = async () => {
      await store.dispatch('chat/addMessage', {
        channel: store.state.chat.selectedChannel,
        message: `/quit ${props.channel.name}`
      })
    }

    return {
      active,
      isUserAdmin,
      selectChannel,
      openLeaveChannelDialog,
      openDeleteChannelDialog
    }
  }
})
</script>

<style scoped>

</style>
