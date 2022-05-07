<template>
  <q-layout view="hHh LpR lFr">
    <NavBar/>

    <ChannelsDrawer/>

    <UsersDrawer/>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import UsersDrawer from 'components/users/UsersDrawer.vue'
import ChannelsDrawer from 'components/channels/ChannelsDrawer.vue'

import { defineComponent, onMounted } from 'vue'
import NavBar from 'components/header/Navbar.vue'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'ChatLayout',

  components: {
    NavBar,
    UsersDrawer,
    ChannelsDrawer
  },

  setup () {
    const store = useStore()

    onMounted(() => {
      store.commit('chat/SET_USER_STATUS', { user: store.state.auth.user!.nickname, status: 'ONLINE' })
    })

    return {}
  }

})

</script>
