import { VueWrapper, mount } from '@vue/test-utils'
import { h } from 'vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import DropDown from '@/components/DropDown.vue'

global.ResizeObserver = require('resize-observer-polyfill')

type LocalTestCtx = {
  wrapper: VueWrapper
  slots: Record<string, any>
}

describe('DropDown', () => {
  beforeEach<LocalTestCtx>((ctx) => {
    const vuetify = createVuetify({ components })

    ctx.slots = {
      default: 'Select',
      content: h('div', { id: 'content' }, 'The Content'),
    }

    ctx.wrapper = mount(DropDown, {
      global: {
        plugins: [vuetify],
      },
      slots: {
        ...ctx.slots,
      },
    })
  })

  afterEach<LocalTestCtx>(({ wrapper }) => {
    wrapper.unmount()
  })

  it<LocalTestCtx>('mounts', ({ wrapper, slots, expect }) => {
    expect(wrapper.text()).toContain(slots['default'])

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it<LocalTestCtx>('can toggle contents on click', async ({ wrapper, slots, expect }) => {
    const button = wrapper.getComponent({ name: 'VBtn' })

    expect(document.getElementById('content')?.innerHTML).toBeUndefined()
    await button.trigger('click')
    expect(document.getElementById('content')?.innerHTML).toEqual(slots['content'].children)
    await button.trigger('click')
    expect(document.getElementById('content')?.parentElement?.style.display).toEqual('none')
    await button.trigger('click')
    expect(document.getElementById('content')?.parentElement?.style.display).toEqual('')
  })
})
