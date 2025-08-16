<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <div class="text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tu cuenta ha sido bloqueada</h3>
        
        <div class="text-sm text-gray-600 mb-6 space-y-3">
          <p>
            Tu cuenta ha sido bloqueada debido a un reporte recibido. No podrás utilizar tu cuenta hasta nuevo aviso.
          </p>
          <p>
            Si deseas apelar esta decisión o tienes alguna consulta sobre el reporte, puedes contactarnos enviando un correo a:
          </p>
          <div class="bg-gray-100 p-3 rounded-md">
            <a 
              href="mailto:contacto@lexic.cl" 
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              contacto@lexic.cl
            </a>
          </div>
          <p class="text-xs text-gray-500">
            Estaremos encantados de revisar el caso y discutir sobre el reporte si es necesario.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>