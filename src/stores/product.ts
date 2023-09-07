export const useProductStore = defineStore('product', () => {
  const baseUrl = 'https://fakestoreapi.com/products'
  const products = ref<Product[]>([])
  const categories = ref<string[]>([])

  const searchString = ref('')
  const selectedCategories = ref<string[]>([])
  const desiredPriceRange = ref([0, 1])

  const prices = computed(() => products.value?.map((d) => d.price))

  const minPrice = computed(() => (prices.value?.length ? Math.min(...prices.value) : 0))
  const maxPrice = computed(() => (prices.value?.length ? Math.max(...prices.value) : 0))

  const productQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const url = baseUrl
      const { data } = await axios.get(url)
      products.value = [...data]
      desiredPriceRange.value = [minPrice.value, maxPrice.value]
      return data
    },
  })

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const url = `${baseUrl}/categories`
      const { data } = await axios.get(url)
      categories.value = [...data]
      selectedCategories.value = [...data]
      return data
    },
  })

  const filteredProducts = computed(() => {
    const regex = new RegExp(searchString.value, 'i')
    if (productQuery.isSuccess.value)
      return products.value
        ?.filter((d) => regex.test(d.title))
        ?.filter((d) => d.price >= desiredPriceRange.value[0] && d.price <= desiredPriceRange.value[1])
        ?.filter((d) => selectedCategories.value.includes(d.category))
  })

  const delProductMutation = useMutation({
    mutationKey: ['products', 'del'],
    mutationFn: async (delID: number) => {
      const url = `${baseUrl}/${delID}`
      const { data } = await axios.delete(url)
      products.value = products.value.filter(({ id }) => id !== delID)
      return data as Product
    },
  })

  const createOrUpdateProductMutation = useMutation({
    mutationKey: ['products', 'createOrUpdate'],
    mutationFn: async (product: Product) => {
      const urlID = product.id ? `/${product.id}` : ''
      const url = `${baseUrl}${urlID}`
      const { data } = await axios(url, { method: product.id ? 'PUT' : 'POST', data: product })
      if (product.id) {
        products.value = products.value.map((p) => {
          if (p.id === product.id) {
            return product
          }
          return p
        })
      } else {
        products.value = [...products.value, product]
      }
      return data
    },
  })

  return {
    products,
    isSuccess: computed(() => productQuery.isSuccess && categoryQuery.isSuccess),
    isLoading: productQuery.isLoading,
    categories,
    minPrice,
    maxPrice,
    filteredProducts,
    searchString,
    selectedCategories,
    desiredPriceRange,
    createOrUpdateProduct: createOrUpdateProductMutation.mutate,
    isMutating: createOrUpdateProductMutation.isLoading,
    isMutated: createOrUpdateProductMutation.isSuccess,
    deleteProduct: delProductMutation.mutate,
    isDeleting: delProductMutation.isLoading,
    isDeleted: delProductMutation.isSuccess,
  }
})
