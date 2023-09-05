import { VueWrapper, mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import SearchBar from '@/components/SearchBar.vue'

type LocalTestCtx = {
  wrapper: VueWrapper
}

describe('SearchBar', () => {
  beforeEach<LocalTestCtx>((ctx) => {
    const vuetify = createVuetify({ components })
    ctx.wrapper = mount(SearchBar, {
      global: {
        plugins: [vuetify],
      },
    })
  })

  afterEach<LocalTestCtx>(({ wrapper }) => {
    wrapper.unmount()
  })

  it<LocalTestCtx>('mounts', async ({ wrapper, expect }) => {
    expect(wrapper.text()).toContain('Find products')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it<LocalTestCtx>('sets the value', async ({ wrapper, expect }) => {
    const searchString = 'test search'
    const input = wrapper.get('input')

    await input.setValue(searchString)
    expect(input.element.value).toBe(searchString)
  })

  it<LocalTestCtx>('emits input', async ({ wrapper, expect }) => {
    const searchString = 'clicked'
    const input = wrapper.get('input')

    await input.setValue(searchString)
    await wrapper.getComponent({ name: 'VIcon' }).trigger('click')
    expect(wrapper.emitted('search')?.[0][0]).toBe(searchString)

    await input.setValue(searchString)
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('search')?.[0][0]).toBe(searchString)
  })
})
