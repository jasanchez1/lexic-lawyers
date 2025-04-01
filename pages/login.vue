<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-bold text-gray-900">Iniciar sesión</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Portal exclusivo para abogados de Lexic
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div v-if="error" class="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
            {{ error }}
          </div>
  
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="form-input"
                />
              </div>
            </div>
  
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="form-input"
                />
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>
  
              <div class="text-sm">
                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  <span
                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"
                  ></span>
                  Cargando...
                </span>
                <span v-else>Iniciar sesión</span>
              </button>
            </div>
          </form>
  
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  No tienes una cuenta aún
                </span>
              </div>
            </div>
  
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Contacta a nuestro equipo para registrar tu perfil como abogado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  
  definePageMeta({
    layout: false
  })
  
  const email = ref('')
  const password = ref('')
  const { login, isLoading, error } = useAuth()
  const router = useRouter()
  
  const handleLogin = async () => {
    if (!email.value || !password.value) return
  
    const result = await login(email.value, password.value)
    
    if (result.success) {
      router.push('/')
    }
  }
  </script>