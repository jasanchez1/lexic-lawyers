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
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());
</script>