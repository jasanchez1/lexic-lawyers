<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Initialize auth when app loads
const { initAuth } = useAuth()

onMounted(async () => {
  await initAuth()
})
</script>
