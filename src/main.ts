import 'virtual:uno.css'
import 'vuetify/styles'
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createRouter, createWebHistory } from 'vue-router/auto'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const vuetify = createVuetify({
  components: { ...components, VSkeletonLoader },
  directives,
})

const router = createRouter({
  history: createWebHistory(),
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(VueQueryPlugin)
app.mount('#app')
