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
        <div v-if="errorMsg" class="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
          {{ errorMsg }}
        </div>

        <!-- Self-contained form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
              required
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember" 
                v-model="rememberMe" 
                type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">Recordarme</label>
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
              class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false
});

const isLoading = ref(false);
const errorMsg = ref(null);
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

// Get the auth composable inside the setup function
const { login } = useAuth();

// Helper function to translate and format error messages
const formatErrorMessage = (error) => {
  // First extract the error message as a string
  let errorText;
  
  if (error === null || error === undefined) {
    errorText = 'Error desconocido';
    return errorText;
  }
  
  if (typeof error === 'string') {
    errorText = error;
  } else if (typeof error === 'object') {
    // Try to extract detail or message property
    if (error.detail) {
      errorText = error.detail;
    } else if (error.message) {
      errorText = error.message;
    } else {
      // Try to convert the object to a readable string
      try {
        errorText = JSON.stringify(error);
      } catch (e) {
        // If JSON stringify fails
        return 'Error de autenticación';
      }
    }
  } else {
    // Fallback
    errorText = String(error);
  }
  
  // Translate common error messages from English to Spanish
  const errorTranslations = {
    'Invalid authentication credentials': 'Credenciales de autenticación inválidas',
    'Authentication failed': 'Autenticación fallida',
    'User not found': 'Usuario no encontrado',
    'Invalid password': 'Contraseña inválida',
    'Not authorized': 'No autorizado',
    'Invalid username or password': 'Usuario o contraseña incorrectos',
    'Authorization failed': 'Autorización fallida',
    'Invalid credentials': 'Credenciales inválidas',
    'Username or password is incorrect': 'Usuario o contraseña incorrectos',
    'User is not active': 'Usuario no está activo',
    'Error logging in': 'Error al iniciar sesión',
    'Login failed': 'Inicio de sesión fallido'
  };
  
  // Return translated message or original if no translation exists
  return errorTranslations[errorText] || errorText;
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = 'Por favor ingrese su email y contraseña';
    return;
  }
  
  isLoading.value = true;
  errorMsg.value = null;
  
  try {
    const result = await login(email.value, password.value);
    
    if (result.success) {
      // Redirect to dashboard
      navigateTo('/');
    } else {
      // Translate and format the error
      errorMsg.value = formatErrorMessage(result.error) || 'Usuario o contraseña incorrectos';
    }
  } catch (err) {
    console.error('Login error:', err);
    // Also translate any caught errors
    errorMsg.value = formatErrorMessage(err) || 'Error durante el inicio de sesión';
  } finally {
    isLoading.value = false;
  }
};
</script>