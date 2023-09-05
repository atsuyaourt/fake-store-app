/// <reference types="vitest" />
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'

import Unocss from 'unocss/vite'

import { VueRouterAutoImports } from 'unplugin-vue-router'

export default defineConfig({
  plugins: [
    VueRouter({ dts: 'src/typed-router.d.ts' }),
    Vue(),
    Unocss(),
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          '@tanstack/vue-query': ['useQuery'],
          axios: [['default', 'axios']],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables'],
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    root: 'test/unit',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
})
