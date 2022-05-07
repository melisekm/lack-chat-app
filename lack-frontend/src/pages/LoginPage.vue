<template>
  <q-layout class="row bg-dark text-white items-center justify-center">
    <div class="col-12 col-md-5  q-px-xl q-my-xl">
      <div class="text-h4 q-pb-md text-center">
        Sign in
      </div>
      <q-form
        class="q-gutter-sm justify center q-mx-auto q-my-auto"
        style="max-width:450px;">
        <q-input
          dark
          filled
          name="email"
          id="email"
          type="email"
          autofocus
          v-model.trim="v$.email.$model"
          label="E-mail"
          :error="v$.email.$error"
          error-message="Please type your email"
          @keydown.exact.enter.prevent="onSubmit"/>

        <q-input
          dark
          filled
          id="password"
          name="password"
          :type="isPwdHidden ? 'password' : 'text'"
          v-model="v$.password.$model"
          label="Password"
          :error="v$.password.$error"
          error-message="Please type your password"
          @keydown.exact.enter.prevent="onSubmit">
          <template v-slot:append>
            <q-icon
              :name="isPwdHidden ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdHidden = !isPwdHidden"
            />
          </template>
        </q-input>

        <div>
          <q-btn
            size="lg"
            class="full-width"
            label="Login"
            color="primary"
            :loading="loading"
            @click="onSubmit">
          </q-btn>
          <q-btn
            flat
            size="md"
            :to="{ name: 'register' }"
            label="Or create new account"
            color="primary"
            class="full-width"
            style="margin: auto">
          </q-btn>
        </div>
      </q-form>
    </div>
    <div class="col-12 col-md-6  q-px-xl q-mb-xl ">
      <div class="introduction-box q-mx-auto q-my-auto text-center "
           style="max-width:450px;">
        <h1 class="q-mt-none" style="font-size: 43px">Welcome to Lack
          <q-icon name="question_answer" class="q-pl-sm"/>
        </h1>
        <router-link class="text-h5 text-white" to="register">Are you new here?</router-link>
      </div>
    </div>

  </q-layout>

</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'src/store'
import { useRoute, useRouter } from 'vue-router'
import { getNegativeNotification } from 'src/utils'
import useVuelidate from '@vuelidate/core'
import {
  required,
  email
} from '@vuelidate/validators'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const redirectTo = computed(() => {
      return (route.query.redirect as string) || { name: 'home' }
    })
    const loading = computed(() => store.state.auth.status === 'pending')
    const credentials = reactive({
      email: '',
      password: ''
    })
    const rules = {
      email: { required, email },
      password: { required }
    }
    const v$ = useVuelidate(rules, credentials)

    const isPwdHidden = ref(true)

    async function onSubmit () {
      const isFormCorrect = await v$.value.$validate()
      if (isFormCorrect) {
        await store.dispatch('auth/login', credentials)
          .then(() => router.push(redirectTo.value))
          .catch((err) => {
            for (const error of err.response.data.errors) {
              getNegativeNotification(error.message.split(':')[1])
            }
          })
      }
    }

    return {
      credentials,
      isPwdHidden,
      onSubmit,
      loading,
      v$
    }
  }
})
</script>
