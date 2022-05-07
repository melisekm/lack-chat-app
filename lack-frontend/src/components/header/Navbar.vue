<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn v-if="$q.screen.lt.md"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        class="q-mr-sm"
      />

      <q-avatar icon="question_answer"/>
      <q-toolbar-title>LACK</q-toolbar-title>
      <ProfileDropdown/>

    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'src/store'
import ProfileDropdown from 'components/header/ProfileDropdown.vue'

export default defineComponent({
  name: 'NavBar',
  components: { ProfileDropdown },
  setup () {
    const store = useStore()
    const toggleLeftDrawer = () => store.commit('ui/toggleLeftDrawer')

    return {
      toggleLeftDrawer
    }
  }

})
</script>

<style scoped>
</style>
