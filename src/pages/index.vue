<template>
  <div class="un-flex un-flex-col un-justify-center un-items-center un-gap-4">
    <SearchBar @search="searchString = $event"></SearchBar>

    <div class="un-flex un-space-x-4">
      <DropDown :isLoading="catIsLoading">
        Product Type
        <template #content>
          <DropDownItems :items="categories" v-model="selectedCategories"></DropDownItems>
        </template>
      </DropDown>
      <DropDown :isLoading="catIsLoading">
        Price
        <template #content>
          <RangeSlider :min="minPrice" :max="maxPrice" v-model="priceRange"></RangeSlider>
        </template>
      </DropDown>
    </div>

    <div class="un-grid sm:un-grid-cols-2 md:un-grid-cols-4 un-gap-2 md:un-gap-4">
      <div v-for="item in filteredProducts" key="item.id">
        <Item :data="item"></Item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const searchString = ref('')
  const selectedCategories = ref([] as string[])
  const priceRange = ref([0, 1])

  const getProducts = async () => {
    const url = 'https://fakestoreapi.com/products'
    const { data } = await axios.get(url)
    return data as Product[]
  }

  const getCategories = async () => {
    const url = 'https://fakestoreapi.com/products/categories'
    const { data } = await axios.get(url)
    selectedCategories.value = data
    return data
  }

  const { data: products, isSuccess: productIsSuccess } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: categories, isLoading: catIsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const filteredProducts = computed(() => {
    const regex = new RegExp(searchString.value, 'i')
    if (productIsSuccess.value)
      return products.value
        ?.filter((d) => regex.test(d.title))
        ?.filter((d) => d.price >= priceRange.value[0] && d.price <= priceRange.value[1])
        ?.filter((d) => selectedCategories.value.includes(d.category))
  })

  watch(productIsSuccess, (isSuccess) => {
    if (isSuccess) {
      priceRange.value = [minPrice.value, maxPrice.value]
    }
  })

  const prices = computed(() => products.value?.map((d) => d.price))
  const minPrice = computed(() => (prices.value?.length ? Math.min(...prices.value) : 0))
  const maxPrice = computed(() => (prices.value?.length ? Math.max(...prices.value) : 0))
</script>
