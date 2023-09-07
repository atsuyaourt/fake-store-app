<template>
  <v-snackbar v-model="snackbar" :timeout="snackBarOpts.timeout" :color="snackBarOpts.color">
    {{ snackBarOpts.text }}
  </v-snackbar>
  <v-data-table
    :headers="headers"
    :items="products"
    :loading="isLoading"
    first-icon="i-mdi:chevron-double-left"
    prev-icon="i-mdi:chevron-left"
    next-icon="i-mdi:chevron-right"
    last-icon="i-mdi:chevron-double-right"
    sort-asc-icon="i-mdi:arrow-up"
    sort-desc-icon="i-mdi:arrow-down"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Products</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props"> New Item </v-btn>
          </template>
          <product-form
            :data="activeProduct"
            @close="handleClose"
            @created="handleCreateSuccess($event)"
            @updated="handleUpdateSuccess($event)"
          />
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="handleClose">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="handleDeleteItemConfirm" :loading="isDeleting"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="handleEditItem(item.raw)" icon="i-mdi:pencil" />
      <v-icon size="small" @click="handleDeleteItem(item.raw)" icon="i-mdi:delete" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  const products = ref([] as Product[])
  const activeProduct = ref({} as Product)

  const getProducts = async () => {
    const url = 'https://fakestoreapi.com/products'
    const { data } = await axios.get(url)

    products.value = data
    return data as Product[]
  }

  const delProduct = async (delID: number) => {
    const url = `https://fakestoreapi.com/products/${delID}`
    const { data } = await axios.delete(url)

    products.value = products.value.filter(({ id }) => id !== delID)
    return data as Product
  }

  const { isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationKey: ['products', 'del'],
    mutationFn: delProduct,
    onSuccess: () => {
      snackBarOpts.text = 'Item deleted'
      snackBarOpts.color = 'error'
      snackbar.value = true
      handleClose()
    },
  })

  const headers = [
    {
      title: 'Name',
      align: 'start',
      sortable: false,
      key: 'title',
    },
    { title: 'Category', align: 'start', key: 'category' },
    { title: 'Price', align: 'start', key: 'price' },
    { title: 'Actions', key: 'actions', sortable: false },
  ]

  const dialog = ref(false)
  const dialogDelete = ref(false)
  const snackbar = ref(false)

  const snackBarOpts = reactive({
    timeout: 2000,
    text: '',
    color: 'success',
  })

  const handleEditItem = (product: Product) => {
    activeProduct.value = { ...product }
    dialog.value = true
  }

  const handleDeleteItem = (product: Product) => {
    activeProduct.value = { ...product }
    dialogDelete.value = true
  }

  const handleClose = () => {
    activeProduct.value = {} as Product
    dialog.value = false
    dialogDelete.value = false
  }

  const handleCreateSuccess = (newProduct: Product) => {
    products.value = [...products.value, newProduct]
    snackBarOpts.text = 'New item added'
    snackBarOpts.color = 'success'
    snackbar.value = true
    handleClose()
  }

  const handleUpdateSuccess = (updatedProduct: Product) => {
    products.value = products.value.map((p) => {
      if (p.id === updatedProduct.id) {
        return updatedProduct
      }
      return p
    })
    snackBarOpts.text = 'Item updated'
    snackBarOpts.color = 'success'
    snackbar.value = true
    handleClose()
  }

  const handleDeleteItemConfirm = () => {
    mutate(activeProduct.value.id)
  }
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
