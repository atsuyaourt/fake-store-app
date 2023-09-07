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
              :items="productStore.categories"
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
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="save"
        :disabled="saveButtonDisabled"
        :loading="productStore.isMutating"
      >
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

  const isEmpty = (str: string) => !str?.length

  const saveButtonDisabled = computed(() => isEmpty(formData.value?.title) || isEmpty(formData.value?.category))

  const emit = defineEmits<{
    close: []
    ok: [type: 'updated' | 'created']
  }>()

  const productStore = useProductStore()
  const { isMutated } = storeToRefs(productStore)

  const formTitle = computed(() => (formData?.value?.id ? 'Edit Item' : 'New Item'))

  const close = () => {
    formData.value = {} as Product
    emit('close')
  }

  const save = () => {
    productStore.createOrUpdateProduct(formData.value)
  }

  watch(isMutated, (isMut) => {
    if (isMut) {
      emit('ok', formData.value.id ? 'updated' : 'created')
    }
  })

  onMounted(() => {
    formData.value = data?.value
  })
</script>
