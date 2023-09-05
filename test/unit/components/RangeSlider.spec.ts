import { VueWrapper, mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import RangeSlider from '@/components/RangeSlider.vue'

type LocalTestCtx = {
  wrapper: VueWrapper
}

describe('RangeSlider', () => {
  beforeEach<LocalTestCtx>((ctx) => {
    const vuetify = createVuetify({ components })

    ctx.wrapper = mount(RangeSlider, {
      global: {
        plugins: [vuetify],
      },
      props: {
        min: 5.0,
        max: 35.0,
        modelValue: [5.0, 35.0],
        'onUpdate:modelValue': (e: [number, number]) => ctx.wrapper?.setProps({ modelValue: e }),
      },
    })
  })

  afterEach<LocalTestCtx>(({ wrapper }) => {
    wrapper.unmount()
  })

  it<LocalTestCtx>('mounts', ({ wrapper, expect }) => {
    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs).toHaveLength(2)

    const rngSlider = wrapper.findComponent({ name: 'VRangeSlider' })
    expect(rngSlider.exists()).toBe(true)
  })

  it<LocalTestCtx>('updates state via minInput', async ({ wrapper, expect }) => {
    const [minInput] = wrapper.findAll('input[type="text"]')
    const rngSlider = wrapper.getComponent({ name: 'VRangeSlider' })

    const newMinVal = 12.0

    expect(+(minInput.element as HTMLInputElement).value).toEqual(wrapper.props('min'))

    await minInput.setValue(newMinVal)
    expect(+(minInput.element as HTMLInputElement).value).toBeCloseTo(newMinVal)
    expect(wrapper.props('modelValue')[0]).toBeCloseTo(newMinVal)

    expect(rngSlider.props('modelValue')).toEqual([newMinVal, wrapper.props('max')])
  })

  it<LocalTestCtx>('updates state via maxInput', async ({ wrapper, expect }) => {
    const [, maxInput] = wrapper.findAll('input[type="text"]')
    const rngSlider = wrapper.getComponent({ name: 'VRangeSlider' })

    const newMaxVal = 99.9

    expect(+(maxInput.element as HTMLInputElement).value).toEqual(wrapper.props('max'))

    await maxInput.setValue(newMaxVal)
    expect(+(maxInput.element as HTMLInputElement).value).toBeCloseTo(newMaxVal)
    expect(wrapper.props('modelValue')[1]).toBeCloseTo(newMaxVal)

    expect(rngSlider.props('modelValue')).toEqual([wrapper.props('min'), newMaxVal])
  })

  it<LocalTestCtx>('updates state via VRangeSlider', async ({ wrapper, expect }) => {
    const [minInput, maxInput] = wrapper.findAll('input[type="text"]')
    const rngSlider = wrapper.getComponent({ name: 'VRangeSlider' })

    const newMinVal = 12.0
    const newMaxVal = 99.9

    await rngSlider.setValue([newMinVal, newMaxVal])

    expect(+(minInput.element as HTMLInputElement).value).toBeCloseTo(newMinVal)
    expect(+(maxInput.element as HTMLInputElement).value).toBeCloseTo(newMaxVal)
  })
})
