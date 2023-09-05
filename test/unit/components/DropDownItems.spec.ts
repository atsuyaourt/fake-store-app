import { VueWrapper, mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import DropDownItems from '@/components/DropDownItems.vue'

type LocalTestCtx = {
  wrapper: VueWrapper
}

describe('DropDownItems', () => {
  beforeEach<LocalTestCtx>((ctx) => {
    const vuetify = createVuetify({ components })
    const items = ['item1', 'item2', 'item3']

    ctx.wrapper = mount(DropDownItems, {
      global: {
        plugins: [vuetify],
      },
      props: {
        items,
        modelValue: items,
        'onUpdate:modelValue': (e: string[]) => ctx.wrapper?.setProps({ modelValue: e }),
      },
    })
  })

  afterEach<LocalTestCtx>(({ wrapper }) => {
    wrapper.unmount()
  })

  it<LocalTestCtx>('mounts', async ({ wrapper, expect }) => {
    const items: string[] = wrapper.props('items')

    // checkboxes exist with count = items.length + 1
    const chkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(chkboxes).toHaveLength(items.length + 1)

    // all should have checked state
    const chkStates = chkboxes?.map((c) => (c.element as HTMLInputElement).checked)
    expect(chkStates?.every(Boolean)).toEqual(true)

    // has correct labels
    expect(wrapper.get('[data-testid="item-select-all"]').text()).toContain('Select All')
    items.forEach((item) => {
      expect(wrapper.get(`[data-testid="item-${item}"]`).text()).toContain(item)
    })
  })

  it<LocalTestCtx>('has v-model', async ({ wrapper, expect }) => {
    const items: string[] = wrapper.props('items')

    const [, ...chkboxes] = wrapper.findAll('input[type="checkbox"]')
    if (chkboxes)
      for (const [idx, chkbx] of chkboxes?.entries()) {
        await chkbx.trigger('click')
        expect(wrapper.props('modelValue').sort()).toEqual(items.filter((...args) => args[1] !== idx).sort())
        await chkbx.trigger('click')
      }
  })

  it<LocalTestCtx>('has "Select All" toggle', async ({ wrapper, expect }) => {
    const items: string[] = wrapper.props('items')
    const [selAllChkbox, ...chkboxes] = wrapper.findAll('input[type="checkbox"]')

    await selAllChkbox.setValue(false)
    expect(wrapper.props('modelValue')).toHaveLength(0)

    await selAllChkbox.setValue(true)
    expect(wrapper.props('modelValue').sort()).toEqual(items.sort())

    if (chkboxes)
      for (const chkbx of chkboxes) {
        await chkbx.trigger('click')
        expect((selAllChkbox.element as HTMLInputElement).checked).toBe(false)
        await chkbx.trigger('click')
      }
  })
})
