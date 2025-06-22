<template>
  <div v-if="showBanner" class="bg-yellow-50 border-b border-yellow-200">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
          <p class="text-sm font-medium text-yellow-800">
            Tu cuenta está pendiente de verificación. Algunas funciones pueden estar limitadas.
          </p>
        </div>
        <button
          @click="checkStatus"
          class="ml-4 flex-shrink-0 text-sm font-medium text-yellow-700 hover:text-yellow-800 underline"
        >
          Verificar estado
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'
import { useNotifications } from '~/composables/useNotifications'

const { profile, fetchProfile } = useProfile()
const { user } = useAuth()
const { success } = useNotifications()

// Only show banner if user has a lawyer_id but profile is not verified
const showBanner = computed(() => {
  return user.value?.lawyer_id && profile.value && !profile.value.is_verified
})

const checkStatus = async () => {
  try {
    const updatedProfile = await fetchProfile()
    
    if (updatedProfile?.is_verified) {
      success('¡Cuenta verificada!', 'Tu cuenta ha sido verificada. Recargando...')
      
      // Reload the page to update permissions
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  } catch (error) {
    console.error('Error checking verification status:', error)
  }
}

// Check profile on mount if user has lawyer_id
onMounted(async () => {
  if (user.value?.lawyer_id && !profile.value) {
    await fetchProfile()
  }
})
</script>