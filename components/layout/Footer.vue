<template>
    <footer class="bg-white border-t border-gray-200 py-4">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Logo and copyright -->
          <div class="mb-4 md:mb-0">
            <div class="text-lg font-bold text-primary-600">Lexic</div>
            <p class="text-sm text-gray-500">
              &copy; {{ currentYear }} Lexic. Todos los derechos reservados.
            </p>
          </div>
          
          <!-- Links -->
          <div class="flex flex-wrap gap-4">
            <a href="#" class="text-sm text-gray-600 hover:text-primary-600">Términos y Condiciones</a>
            <a href="#" class="text-sm text-gray-600 hover:text-primary-600">Política de Privacidad</a>
            <a href="#" class="text-sm text-gray-600 hover:text-primary-600">Soporte</a>
            <a href="#" class="text-sm text-gray-600 hover:text-primary-600">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Get current year for copyright
  const currentYear = computed(() => new Date().getFullYear());
  </script>