import { VueWrapper, mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import Item from '@/components/Item.vue'

type LocalTestCtx = {
  vObj: {
    wrapper?: VueWrapper
    mountWithProps(props: any): void
  }
}

describe('Item', () => {
  beforeEach<LocalTestCtx>((ctx) => {
    const vuetify = createVuetify({ components })

    ctx.vObj = {
      wrapper: undefined,
      mountWithProps(props: any) {
        this.wrapper = mount(Item, {
          global: {
            plugins: [vuetify],
            stubs: {
              VSkeletonLoader: true,
            },
          },
          props,
        })
      },
    }
  })

  afterEach<LocalTestCtx>(({ vObj }) => {
    vObj.wrapper?.unmount()
  })

  it<LocalTestCtx>('mounts', ({ vObj, expect }) => {
    vObj.mountWithProps({})

    expect(vObj.wrapper?.find('[data-testid="item-loader"]').exists()).toBe(true)

    expect(vObj.wrapper?.find('img').exists()).toBe(false)
    expect(vObj.wrapper?.find('[data-testid="item-title"]').exists()).toBe(false)
    expect(vObj.wrapper?.find('[data-testid="item-price"]').exists()).toBe(false)
  })

  it<LocalTestCtx>('mounts with props', ({ vObj, expect }) => {
    const props = {
      data: {
        image: 'img.png',
        title: 'Title',
        price: '9.99',
      },
    }
    vObj.mountWithProps(props)

    expect(vObj.wrapper?.find('[data-testid="item-loader"]').exists()).toBe(false)

    expect(vObj.wrapper?.find('img').exists()).toBe(true)
    expect(vObj.wrapper?.get('[data-testid="item-title"]').text()).toContain(props.data.title)
    expect(vObj.wrapper?.get('[data-testid="item-price"]').text()).toContain(props.data.price)
  })
})
