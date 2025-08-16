<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-gray-900">Restablecer contraseña</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingrese su nueva contraseña
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

        <form v-if="!passwordReset && tokenValid" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
              required
              minlength="8"
              :disabled="isLoading"
            />
            <p class="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword" 
              type="password" 
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
                Restableciendo...
              </span>
              <span v-else>Restablecer contraseña</span>
            </button>
          </div>
        </form>

        <div v-if="passwordReset" class="text-center">
          <NuxtLink to="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Ir al inicio de sesión
          </NuxtLink>
        </div>

        <div v-else class="mt-6 text-center">
          <NuxtLink to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthService } from '~/services/auth-service'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false
})

const authService = useAuthService()
const route = useRoute()

const isLoading = ref(false)
const errorMsg = ref(null)
const successMsg = ref(null)
const password = ref('')
const confirmPassword = ref('')
const passwordReset = ref(false)
const tokenValid = ref(false)
const token = ref('')

onMounted(async () => {
  token.value = route.query.token as string;
  
  if (!token.value) {
    errorMsg.value = 'Token de restablecimiento no encontrado';
    return;
  }

  // Validate token
  try {
    const result = await authService.validatePasswordResetToken(token.value);
    if (result.success) {
      tokenValid.value = true;
    } else {
      errorMsg.value = result.message || 'Token inválido o expirado';
    }
  } catch (error) {
    console.error('Token validation error:', error);
    errorMsg.value = error.message || 'Token inválido o expirado';
  }
})

const handleSubmit = async () => {
  if (!password.value || !confirmPassword.value) {
    errorMsg.value = 'Por favor complete todos los campos';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden';
    return;
  }

  if (password.value.length < 8) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres';
    return;
  }
  
  isLoading.value = true;
  errorMsg.value = null;
  successMsg.value = null;
  
  try {
    const result = await authService.confirmPasswordReset(token.value, password.value);
    
    if (result.success) {
      passwordReset.value = true;
      successMsg.value = result.message || 'Contraseña restablecida exitosamente. Ahora puede iniciar sesión con su nueva contraseña.';
    } else {
      errorMsg.value = 'Error al restablecer contraseña';
    }
  } catch (error) {
    console.error('Password reset error:', error);
    errorMsg.value = error.message || 'Error al restablecer contraseña';
  } finally {
    isLoading.value = false;
  }
}
</script>