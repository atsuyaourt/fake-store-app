<template>
  <v-btn color="primary" :append-icon="btnIcon">
    <slot></slot>

    <v-menu activator="parent" :close-on-content-click="false" @update:model-value="handleToggle">
      <slot name="content"></slot>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
  const btnIcon = ref('i-mdi:menu-down')
  const handleToggle = (isActive: boolean) => {
    btnIcon.value = isActive ? 'i-mdi:menu-up' : 'i-mdi:menu-down'
  }
</script>
