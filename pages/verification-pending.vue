<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <!-- Icon -->
        <div class="mb-6 flex justify-center">
          <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock class="w-12 h-12 text-yellow-600" />
          </div>
        </div>
        
        <!-- Title -->
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Tu registro está en revisión
        </h1>
        
        <!-- Description -->
        <p class="text-gray-600 mb-8">
          Estamos verificando tu información y documentos. Este proceso generalmente toma entre 24 a 48 horas hábiles.
        </p>
        
        <!-- Status Information -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div class="flex items-start">
            <AlertCircle class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div class="text-left">
              <h3 class="text-sm font-medium text-yellow-800 mb-1">
                ¿Qué estamos verificando?
              </h3>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• Tu Certificado de Título de la Corte Suprema</li>
                <li>• Tu Certificado de Título Universitario</li>
                <li>• La información de tu perfil profesional</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Additional Information -->
        <div class="space-y-4 text-sm text-gray-600 mb-8">
          <div class="flex items-start">
            <CheckCircle class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <p class="text-left">
              Te enviaremos un correo electrónico cuando tu cuenta esté verificada y lista para usar.
            </p>
          </div>
          
          <div class="flex items-start">
            <Mail class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <p class="text-left">
              Si tienes preguntas sobre el proceso de verificación, puedes contactarnos en <a href="mailto:soporte@lexic.cl" class="text-primary-600 hover:text-primary-700 font-medium">soporte@lexic.cl</a>
            </p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="checkStatus"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
            :disabled="isChecking"
          >
            <RefreshCw 
              class="w-4 h-4 mr-2" 
              :class="{ 'animate-spin': isChecking }"
            />
            {{ isChecking ? 'Verificando...' : 'Verificar Estado' }}
          </button>
          
          <button
            @click="logout"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <!-- Help Text -->
      <p class="mt-6 text-center text-sm text-gray-500">
        El tiempo de verificación puede variar según la carga de trabajo. Apreciamos tu paciencia.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Clock, AlertCircle, CheckCircle, Mail, RefreshCw } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useProfile } from '~/composables/useProfile'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: false,
  middleware: ['lawyer-auth'] // Only check authentication, not verification
})

const { logout: authLogout, user } = useAuth()
const { fetchProfile } = useProfile()
const { success, info } = useNotifications()

const isChecking = ref(false)

// Check verification status
const checkStatus = async () => {
  isChecking.value = true
  
  try {
    // Fetch the latest profile data
    const profile = await fetchProfile()
    
    if (profile && profile.is_verified) {
      success('¡Cuenta verificada!', 'Tu cuenta ha sido verificada. Redirigiendo...')
      
      // Wait a moment for the message to be visible
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    } else {
      info('Verificación pendiente', 'Tu cuenta aún está en proceso de verificación. Por favor, intenta más tarde.')
    }
  } catch (error) {
    console.error('Error checking verification status:', error)
  } finally {
    isChecking.value = false
  }
}

// Logout
const logout = async () => {
  await authLogout()
  navigateTo('/login')
}
</script>