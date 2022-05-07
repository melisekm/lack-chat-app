<template>

  <q-btn flat v-bind="buttonProperties">

    <q-menu class="q-pt-xs">
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Message notifications</q-item-label>
          <q-item-label caption>Show only addressed to me</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="green" v-model="showOnlyAddressedToMe" val="friend"/>
        </q-item-section>
      </q-item>

      <q-separator inset/>

      <q-item clickable>
        <q-item-section side>
          <q-icon name="keyboard_arrow_left"/>
        </q-item-section>
        <q-item-section>Status</q-item-section>
        <q-item-section side>
          <q-item-label caption>
            <q-badge :color="currentStatus.color" :label="currentStatus.label"/>
          </q-item-label>
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <StatusBadge
            v-for="status in statuses"
            :key="status.label"
            :label="status.label"
            :color="status.color"
            :active="status.label === currentStatus.label"
          />
        </q-menu>
      </q-item>

      <q-separator inset/>

      <q-item clickable v-ripple @click="logout">
        <q-item-section side>
          <q-icon name="logout"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
    </q-menu>
  </q-btn>

</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import StatusBadge from 'components/header/StatusBadge.vue'
import { useStore } from 'src/store'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { Status } from 'src/contracts'

export default defineComponent({
  name: 'ProfileDropdown',
  components: { StatusBadge },
  setup () {
    const $q = useQuasar()
    const store = useStore()
    const router = useRouter()

    const logout = async () => {
      await store.dispatch('auth/logout')
        .then(() => router.push({ name: 'login' }))
        .catch((err) => {
          console.log(err)
        })
    }

    const statuses: Status[] = [
      {
        label: 'ONLINE',
        color: 'green'
      },
      {
        label: 'DND',
        color: 'orange'
      },
      {
        label: 'OFFLINE',
        color: 'red'
      }
    ]

    const buttonProperties = computed(() => {
      if ($q.screen.lt.sm) {
        return {
          // dense: true,
          // round: true,
          // icon: 'menu',
          // class: 'q-mr-sm',
          // 'aria-label': 'Menu',
          label: 'Settings',
          'icon-right': 'expand_more'
        }
      }
      return {
        stretch: true,
        'icon-right': 'expand_more',
        label: 'Account Settings'
      }
    })

    const showOnlyAddressedToMe = computed(({
      get: () => store.state.ui.showNotificationsAddressedToMe,
      set: (val) => store.commit('ui/setShowNotificationsAddressedToMe', val)
    }))
    const currentStatus = computed(() => {
      const status = store.state.auth.userStatus
      return statuses.find((s: Status) => s.label === status)
    })
    return {
      currentStatus,
      statuses,
      showOnlyAddressedToMe,
      buttonProperties,
      logout
    }
  }
})
</script>
