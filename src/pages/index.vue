<template>
  <div class="un-flex un-flex-col un-justify-center un-items-center un-gap-4">
    <SearchBar @search="searchString = $event"></SearchBar>

    <div class="un-flex un-space-x-4">
      <DropDown>
        Product Type
        <template #content>
          <DropDownItems :items="productStore.categories" v-model="selectedCategories"></DropDownItems>
        </template>
      </DropDown>
      <DropDown>
        Price
        <template #content>
          <RangeSlider
            :min="productStore.minPrice"
            :max="productStore.maxPrice"
            v-model="desiredPriceRange"
          ></RangeSlider>
        </template>
      </DropDown>
    </div>

    <div class="un-grid sm:un-grid-cols-2 md:un-grid-cols-4 un-gap-2 md:un-gap-4">
      <div v-for="item in productStore.filteredProducts" key="item.id">
        <Item :data="item"></Item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const productStore = useProductStore()
  const { searchString, selectedCategories, desiredPriceRange } = storeToRefs(productStore)
</script>
