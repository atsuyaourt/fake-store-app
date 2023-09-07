<template>
  <v-snackbar v-model="snackbar" :timeout="snackBarOpts.timeout" :color="snackBarOpts.color">
    {{ snackBarOpts.text }}
  </v-snackbar>
  <v-data-table
    :headers="headers"
    :items="productStore.products"
    :loading="productStore.isLoading"
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
          <product-form :data="activeProduct" @close="handleClose" @ok="handleFormSuccess($event)" />
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="handleClose">Cancel</v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="handleDeleteItemConfirm"
                :loading="productStore.isDeleting"
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
  const productStore = useProductStore()
  const activeProduct = ref({} as Product)

  const { isDeleted } = storeToRefs(productStore)

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

  const handleFormSuccess = (type: 'updated' | 'created') => {
    snackBarOpts.text = type === 'created' ? 'New item added' : 'Item updated'
    snackBarOpts.color = 'success'
    snackbar.value = true
    handleClose()
  }

  const handleDeleteItemConfirm = () => {
    productStore.deleteProduct(activeProduct.value?.id ?? 0)
  }

  watch(isDeleted, (isDel) => {
    if (isDel) {
      snackBarOpts.text = 'Item deleted'
      snackBarOpts.color = 'error'
      snackbar.value = true
      handleClose()
    }
  })
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
