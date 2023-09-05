<template>
  <v-card v-if="data" class="un-cursor-pointer group">
    <div class="un-relative">
      <v-img :src="data?.image" class="un-h-48" cover> </v-img>
      <div
        class="un-absolute un-inset-0 un-w-full un-h-full un-bg-gradient-to-tl un-from-slate-800 un-opacity-50 un-transition un-duration-300 un-ease-in-out group-hover:un-opacity-0"
      ></div>
    </div>

    <v-card-item>
      <div class="un-text-xl group-hover:un-underline" data-testid="item-title">{{ data?.title ?? 'Title' }}</div>
      <div class="un-text-lg un-text-gray-400" data-testid="item-price">$ {{ data?.price ?? '0.00' }}</div>
    </v-card-item>
  </v-card>
  <div v-else class="un-w-60" data-testid="item-loader">
    <v-skeleton-loader class="mx-auto border" type="image, article"></v-skeleton-loader>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    data?: Product
  }>()
</script>
