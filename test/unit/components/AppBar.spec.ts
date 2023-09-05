import { mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import AppBar from '@/components/AppBar.vue'

global.ResizeObserver = require('resize-observer-polyfill')

describe('AppBar', () => {
  it('mounts', () => {
    const vuetify = createVuetify({ components })

    const Comp = {
      components: { AppBar },
      template: `<v-app><app-bar /></v-app>`,
    }
    const wrapper = mount(Comp, {
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.text()).toContain('FakeStore')
  })
})
