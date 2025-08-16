<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-gray-900">¿Olvidó su contraseña?</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingrese su email para recibir un enlace de restablecimiento
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="successMsg" class="mb-4 bg-green-50 text-green-700 p-3 rounded-md">
          {{ successMsg }}
        </div>
        
        <div v-if="errorMsg" class="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
          {{ errorMsg }}
        </div>

        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
              required
              :disabled="isLoading"
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
              <span v-else>Enviar enlace de restablecimiento</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthService } from '~/services/auth-service'

definePageMeta({
  layout: false
})

const authService = useAuthService()

const isLoading = ref(false)
const errorMsg = ref(null)
const successMsg = ref(null)
const email = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  if (!email.value) {
    errorMsg.value = 'Por favor ingrese su email'
    return
  }
  
  isLoading.value = true
  errorMsg.value = null
  successMsg.value = null
  
  try {
    const result = await authService.requestPasswordReset(email.value)
    
    if (result.success) {
      emailSent.value = true
      successMsg.value = result.message || 'Si existe una cuenta con ese email, hemos enviado un enlace de restablecimiento.'
    } else {
      errorMsg.value = 'Error al solicitar restablecimiento de contraseña'
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    errorMsg.value = error.message || 'Error al solicitar restablecimiento de contraseña'
  } finally {
    isLoading.value = false
  }
}
</script>