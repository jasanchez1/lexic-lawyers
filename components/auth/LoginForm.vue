<template>
    <div class="w-full max-w-md">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            required
            autocomplete="email"
          />
        </div>
  
        <div>
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            required
            autocomplete="current-password"
          />
        </div>
  
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">Recordarme</label>
          </div>
          
          <div class="text-sm">
            <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">
              ¿Olvidó su contraseña?
            </a>
          </div>
        </div>
  
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <div class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Cargando...
          </span>
          <span v-else>Iniciar sesión</span>
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps<{
    isLoading: boolean;
    error?: string | null;
  }>();
  
  const emit = defineEmits<{
    (e: 'login', data: { email: string; password: string; rememberMe: boolean }): void;
  }>();
  
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  
  const handleLogin = () => {
    console.log('Login attempt with:', email.value, password.value);
    emit('login', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
  };
  </script>
