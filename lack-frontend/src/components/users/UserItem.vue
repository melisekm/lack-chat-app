<template>
  <q-item>
    <q-item-section avatar>
      <q-icon name="person"/>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ user.nickname }}</q-item-label>
      <q-item-label caption style="width:60px;">
        <q-badge :color="userStatus.color" :label="userStatus.label" class="fit justify-center"/>
      </q-item-label>
    </q-item-section>

  </q-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { User } from 'src/contracts'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'UserItem',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const user = computed(() => store.state.auth.user)
    const status = computed(() => store.state.chat.userStatus[props.user.nickname])
    const getStatusColor = (userStatus: string) => {
      switch (userStatus) {
        case 'ONLINE':
          return 'green'
        case 'DND':
          return 'orange'
        case 'OFFLINE':
          return 'red'
        default:
          return 'red'
      }
    }
    const userStatus = ref(
      {
        label: status.value ?? 'OFFLINE',
        color: getStatusColor(status.value)
      }
    )

    store.watch((state) => state.auth.userStatus, (value) => {
      if (props.user.nickname === user.value!.nickname) {
        userStatus.value.color = getStatusColor(value)
        userStatus.value.label = value
      }
    })

    store.watch((state) => state.chat.userStatus[props.user.nickname], (value) => {
      userStatus.value.color = getStatusColor(value)
      userStatus.value.label = value
    })

    return {
      userStatus
    }
  }
})
</script>

<style scoped>

</style>
