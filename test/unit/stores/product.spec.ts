import { createPinia, setActivePinia } from 'pinia'

import { ref } from 'vue'

import { useProductStore } from '@/stores/product'

vi.mock('axios')

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn().mockImplementation(({ queryFn }) => {
    const data = ref()
    const isLoading = ref(false)
    const isSuccess = ref(true)

    const products = [
      { id: 1, title: 'test1', price: 1.0, category: 'cat1' },
      { id: 2, title: 'test2 filter', price: 5.0, category: 'cat2' },
      { id: 3, title: 'test3 filter', price: 99.9, category: 'cat2' },
      { id: 4, title: 'test4', price: 45.9, category: 'cat3' },
    ]

    const categories = ['cat1', 'cat2', 'cat3']

    vi.mocked(axios.get).mockResolvedValueOnce({ data: products }).mockResolvedValueOnce({ data: categories })

    queryFn()
    return {
      data,
      isLoading,
      isSuccess,
    }
  }),
  useMutation: vi.fn().mockImplementation(({ mutationFn }) => {
    const data = ref()
    const isLoading = ref(true)
    const isSuccess = ref(false)
    return {
      data,
      isLoading,
      isSuccess,
      mutate(product: Product) {
        vi.mocked(axios).mockResolvedValue({ data: product })
        vi.mocked(axios.delete).mockResolvedValue({ data: product })
        isLoading.value = true
        isSuccess.value = false
        data.value = mutationFn(product)
        isLoading.value = false
        isSuccess.value = true
      },
    }
  }),
}))

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('products', async () => {
    const prodStore = useProductStore()

    const getNewProducts = new Promise((resolve) => {
      prodStore.$subscribe(() => {
        resolve(prodStore.products)
      })
    })
    const nProducts = (await getNewProducts) as Product[]
    expect(nProducts).toHaveLength(4)
  })

  it('categories', async () => {
    const prodStore = useProductStore()

    const getNewCategories = new Promise((resolve) => {
      prodStore.$subscribe(() => {
        resolve(prodStore.categories)
      })
    })
    const nCategories = (await getNewCategories) as string[]
    expect(nCategories).toHaveLength(3)
  })

  it('filteredProducts', async () => {
    const prodStore = useProductStore()
    prodStore.$patch({
      searchString: 'filter',
      selectedCategories: ['cat2'],
      desiredPriceRange: [5, 100],
    })

    const getNewProducts = new Promise((resolve) => {
      prodStore.$subscribe(() => {
        resolve(prodStore.filteredProducts)
      })
    })
    const nProducts = (await getNewProducts) as Product[]
    expect(nProducts).toHaveLength(2)
  })

  it('createOrUpdateProduct', async () => {
    const prodStore = useProductStore()

    const newProduct = { title: 'test5', price: 11.0, category: 'cat3' } as Product
    const updatedProduct = { id: 3, title: 'test3', price: 99.9, category: 'cat1' } as Product

    prodStore.createOrUpdateProduct(newProduct)
    prodStore.createOrUpdateProduct(updatedProduct)

    const getNewProducts = new Promise((resolve) => {
      prodStore.$subscribe(() => {
        resolve(prodStore.products)
      })
    })
    const nProducts = (await getNewProducts) as Product[]
    const nProdCount = nProducts.length
    const gotNewProduct = nProducts.at(nProdCount - 1)
    const gotUpdatedProduct = nProducts.find(({ id }) => id === updatedProduct.id)

    expect(JSON.stringify(gotNewProduct)).toEqual(JSON.stringify(newProduct))
    expect(JSON.stringify(gotUpdatedProduct)).toEqual(JSON.stringify(updatedProduct))
  })

  it('deleteProduct', async () => {
    const prodStore = useProductStore()

    const delProduct = { id: 2, title: 'test2 filter', price: 5.0, category: 'cat2' } as Product

    prodStore.deleteProduct(delProduct.id as number)
    expect(axios.delete).toHaveBeenCalledTimes(1)

    const getNewProducts = new Promise((resolve) => {
      prodStore.$subscribe(() => {
        resolve(prodStore.products)
      })
    })
    const nProducts = (await getNewProducts) as Product[]

    const delProdIdx = nProducts.findIndex(({ id }) => id === delProduct.id)
    expect(delProdIdx).toEqual(-1)
  })
})
