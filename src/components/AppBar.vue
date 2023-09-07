<template>
  <v-app-bar color="primary" density="compact">
    <v-btn @click="handleHomeClick" variant="text"><v-app-bar-title>FakeStore</v-app-bar-title></v-btn>

    <v-spacer />

    <v-btn @click="handleAdminClick" icon>
      <v-icon icon="i-mdi:view-dashboard"></v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
  const router = useRouter()
  const handleHomeClick = () => {
    router.push('/')
  }
  const handleAdminClick = () => {
    router.push('/admin')
  }
</script>
