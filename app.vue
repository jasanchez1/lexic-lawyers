<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Blocked Lawyer Modal -->
    <AuthBlockedLawyerModal v-model="showBlockedModal" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import AuthBlockedLawyerModal from '~/components/auth/BlockedLawyerModal.vue'

// Initialize auth when app loads
const { initAuth, lawyerProfile, isAuthenticated, isLawyer } = useAuth()
const showBlockedModal = ref(false)

onMounted(async () => {
  await initAuth()
})

// Watch for changes in lawyer profile to check if blocked
watch([lawyerProfile, isAuthenticated, isLawyer], ([profile, authenticated, lawyer]) => {
  if (authenticated && lawyer && profile?.is_blocked) {
    showBlockedModal.value = true
  } else {
    showBlockedModal.value = false
  }
}, { immediate: true })
</script>
