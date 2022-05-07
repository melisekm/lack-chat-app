<template>
  <q-layout class="row bg-dark text-white items-center justify-center">
    <div class="col-12 col-md-5 q-px-xl q-my-xl">

      <div class="text-h4 q-pb-md text-center">
        Welcome to Lack
        <q-icon name="question_answer" class="q-pl-sm"/>
      </div>
      <q-form class="q-gutter-sm q-mx-auto q-my-auto" style="max-width:450px;">
        <q-input
          dark
          filled
          v-model.trim="v$.firstname.$model"
          type="text"
          label="Name"
          autofocus
          :error="v$.firstname.$error"
          error-message="Please type your name">
        </q-input>

        <q-input
          dark
          filled
          v-model.trim="v$.surname.$model"
          type="text"
          label="Surname"
          :error="v$.surname.$error"
          error-message="Please type your surname">
        </q-input>

        <q-input
          dark
          filled
          v-model.trim="v$.email.$model"
          type="email"
          label="E-mail"
          :error="v$.email.$error"
          error-message="Please type your e-mail">
        </q-input>

        <q-input
          type="text"
          dark
          filled
          v-model.trim="v$.nickname.$model"
          label="Nickname"
          :error="v$.nickname.$error"
          error-message="Please create your nickname">
        </q-input>

        <q-input
          dark
          filled
          :type="isPwdHidden ? 'password' : 'text'"
          v-model="v$.password.$model"
          label="Password"
          :error="v$.password.$error"
          error-message="Password must be at least 8 characters long">
          <template v-slot:append>
            <q-icon
              :name="isPwdHidden ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdHidden = !isPwdHidden"
            />
          </template>
        </q-input>

        <q-input
          dark
          filled
          :type="isPwdHidden ? 'password' : 'text'"
          v-model="v$.passwordConfirmation.$model"
          label="Repeat password"
          :error="v$.passwordConfirmation.$error"
          error-message="Please repeat your password">
          <template v-slot:append>
            <q-icon
              :name="isPwdHidden ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdHidden = !isPwdHidden"
            />

          </template>
        </q-input>

        <div class="q-mt-md">
          <q-btn
            :loading="loading"
            size="lg"
            class="full-width"
            label="Register"
            color="primary"
            @click="onSubmit">
          </q-btn>
          <q-btn
            flat
            to="login"
            size="md"
            label="Already registered? Sign in!"
            color="primary"
            class="full-width">
          </q-btn>
        </div>
      </q-form>
    </div>

    <div class="col-12 col-md-5 q-px-xl q-mb-xl text-center">
      <div class="introduction-box q-my-auto q-mx-auto" style="max-width:450px;">
        <h1 class="text-h2 q-mt-none" style="font-size: 43px">Lack</h1>
        <ul class="text-h5 q-pl-lg-lg q-pl-sm" style="list-style: none">
          <li>#1 communication app</li>
          <li>Absolutely free</li>
          <li>Easy to use</li>
        </ul>
        <p class="text-h4">Join us and connect with the world!</p>
      </div>
    </div>
  </q-layout>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, computed } from 'vue'
import { useStore } from 'src/store'
import { useRouter } from 'vue-router'
import { getNegativeNotification, getPositiveNotification } from 'src/utils'
import useVuelidate from '@vuelidate/core'
import {
  required,
  email,
  minLength,
  maxLength
} from '@vuelidate/validators'

export default defineComponent({
  name: 'RegisterPage',
  setup () {
    const store = useStore()
    const router = useRouter()
    const credentials = reactive({
      firstname: '',
      surname: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      nickname: ''
    })
    const passwordIsSame = (password: string) => {
      return password === credentials.password
    }

    const rules = {
      firstname: { required, maxLength: maxLength(255) },
      surname: { required, maxLength: maxLength(255) },
      password: { required, minLength: minLength(8) },
      passwordConfirmation: { required, sameAsPassword: passwordIsSame, minLength: minLength(8) },
      email: { required, email },
      nickname: { required, maxLength: maxLength(255) }
    }
    const v$ = useVuelidate(rules, credentials)

    const isPwdHidden = ref(true)
    const redirectTo = computed(() => {
      return { name: 'login' }
    })

    const loading = computed(() => store.state.auth.status === 'pending')

    async function onSubmit () {
      const isFormCorrect = await v$.value.$validate()
      if (isFormCorrect) {
        store.dispatch('auth/register', credentials)
          .then(() => getPositiveNotification('You have been successfully registered. You will be redirected to the login page.'))
          .then(() => setTimeout(() => router.push(redirectTo.value), 4500))
          .catch((err) => {
            for (const error of err.response.data.errors) {
              getNegativeNotification(error.message)
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
