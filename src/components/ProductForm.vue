<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <div>
          <div>
            <v-text-field v-model="formData.title" label="Product name"></v-text-field>
            <v-select
              v-model="formData.category"
              label="Category"
              :items="categories"
              menu-icon="i-mdi:chevron-down"
            ></v-select>
            <v-textarea v-model="formData.description" label="Description"></v-textarea>
          </div>
        </div>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="save" :disabled="saveButtonDisabled" :loading="isLoading">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data: Product
  }>()
  const { data } = toRefs(props)

  const formData = ref({} as Product)

  const saveButtonDisabled = computed(
    () => formData.value?.title === undefined && formData.value?.category === undefined,
  )

  const emit = defineEmits<{
    close: []
    created: [data: Product]
    updated: [data: Product]
  }>()

  const getCategories = async () => {
    const url = 'https://fakestoreapi.com/products/categories'
    const { data } = await axios.get(url)
    return data
  }

  const addOrEditProduct = async (product: Product) => {
    const urlID = product.id ? `/${product.id}` : ''
    const url = `https://fakestoreapi.com/products${urlID}`
    const { data } = await axios(url, { method: product.id ? 'PUT' : 'POST', data: product })
    return data
  }

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { mutate, isLoading } = useMutation({
    mutationKey: ['products', formData.value.id ? formData.value.id : 'new'],
    mutationFn: addOrEditProduct,
    onSuccess: (data: Product) => {
      formData?.value?.id ? emit('updated', data) : emit('created', data)
    },
  })

  const formTitle = computed(() => (formData?.value?.id ? 'Edit Item' : 'New Item'))

  const close = () => {
    formData.value = {} as Product
    emit('close')
  }

  const save = () => {
    mutate(formData.value)
  }

  onMounted(() => {
    formData.value = data?.value
  })
</script>
