<template>
  <v-card>
    <v-card-text>
      <v-checkbox-btn
        v-model="allSelected"
        true-icon="i-mdi:checkbox-marked"
        false-icon="i-mdi:checkbox-blank-outline"
        class="un-pl-4 un-pb-2"
        @update:model-value="selectedItems = $event ? items : []"
      >
        <template v-slot:label>
          <span class="un-pl-2.5" data-testid="item-select-all">Select All</span>
        </template>
      </v-checkbox-btn>
      <v-divider></v-divider>
      <v-list v-model:selected="selectedItems" select-strategy="classic">
        <v-list-item v-for="cat in items" :key="cat" :value="cat">
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="isActive"
                true-icon="i-mdi:checkbox-marked"
                false-icon="i-mdi:checkbox-blank-outline"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title v-text="cat" :data-testid="`item-${cat}`"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: string[]
    modelValue: string[]
  }>()
  const { items, modelValue } = toRefs(props)

  const emit = defineEmits<{
    'update:modelValue': [selectedItems: string[]]
  }>()

  const allSelected = ref(true)
  const selectedItems = ref([] as string[])

  watch(selectedItems, (sItems) => {
    emit('update:modelValue', sItems)
    allSelected.value = sItems?.length === items.value.length
  })

  onMounted(() => {
    selectedItems.value = modelValue.value
  })
</script>
