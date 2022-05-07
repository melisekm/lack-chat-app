<template>
  <q-item clickable :active="active" active-class="bg-teal-2" @click="setUserStatus"  class="row justify-center">
    <q-item-label caption class="q-py-xs" style="width:75px;">
      <q-badge :color="color" class="fit justify-center" :label="label"/>
    </q-item-label>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'StatusBadge',
  props: {
    color: {
      type: String,
      default: 'grey',
      required: true
    },
    label: {
      type: String,
      default: 'unknown',
      required: true
    },
    active: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const setUserStatus = () => {
      store.dispatch('auth/setStatusAction', props.label)
    }
    return {
      setUserStatus
    }
  }
}
)
</script>

<style scoped>

</style>
