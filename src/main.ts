import 'virtual:uno.css'
import 'vuetify/styles'
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

import { VueQueryPlugin } from '@tanstack/vue-query'

import { createPinia } from 'pinia'

import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router/auto'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const pinia = createPinia()

const vuetify = createVuetify({
  components: { ...components, VSkeletonLoader, VDataTable },
  directives,
})

const recursiveLayouts = (route: RouteRecordRaw): RouteRecordRaw => {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++) {
      route.children[i] = recursiveLayouts(route.children[i])
    }

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(),
  extendRoutes: (routes) => routes.map((route) => recursiveLayouts(route)),
})

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(VueQueryPlugin)
app.mount('#app')
