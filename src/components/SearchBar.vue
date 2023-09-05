<template>
  <v-text-field
    v-model="searchString"
    density="compact"
    variant="outlined"
    label="Find products"
    append-inner-icon="i-mdi:magnify"
    single-line
    hide-details
    @click:append-inner="handleSearch"
    @keydown.enter.prevent="handleSearch"
    class="un-w-full sm:un-w-96"
  ></v-text-field>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    search: [searchString: string]
  }>()

  const searchString = ref('')

  const handleSearch = () => {
    emit('search', searchString.value)
  }
</script>
