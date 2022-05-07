import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // try redirect to home route
    redirect: () => ({ name: 'home' })
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'register', name: 'register', meta: { guestOnly: true }, component: () => import('pages/RegisterPage.vue') },
      { path: 'login', name: 'login', meta: { guestOnly: true }, component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/channels',
    meta: { requiresAuth: true },
    component: () => import('layouts/ChatLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/ChatPage.vue') },
      { path: ':name', name: 'channel', component: () => import('pages/ChatPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404Page.vue')
  }
]

export default routes
