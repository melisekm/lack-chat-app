<template>
  <q-drawer v-model="drawerOpen" side="right" class="bg-dark text-white" show-if-above elevated>
    <q-list>
      <q-item-label header class="text-white"> Users</q-item-label>
      <q-item v-if="!channelLoading && (users && users.length === 0)">
        <q-item-section>
          <q-item-label>
            No users
          </q-item-label>
        </q-item-section>
      </q-item>
      <UserItem
        v-for="user in users"
        :key="user.id"
        :user="user"
      />

    </q-list>
    <q-inner-loading
      :showing="channelLoading"
      label="Loading..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-drawer>
</template>

<script lang="ts">
import UserItem from 'components/users/UserItem.vue'

import { computed, defineComponent } from 'vue'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'UsersDrawer',
  components: { UserItem },
  setup () {
    const store = useStore()
    const users = computed(() => store.getters['chat/currentUsers'])
    const channelLoading = computed(() => store.state.chat.loading)
    const drawerOpen = computed(({
      get: () => store.state.ui.rightDrawerState,
      set: (val) => store.commit('ui/setRightDrawerState', val)
    }))
    return {
      users,
      channelLoading,
      drawerOpen
    }
  }
})
</script>

<style scoped>

</style>
