<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-lg font-medium mb-4">Tu Respuesta</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <textarea
            v-model="content"
            rows="6"
            placeholder="Escribe tu respuesta detallada aquí..."
            class="form-input"
            required
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            Proporciona una respuesta clara y profesional. Tu conocimiento es valioso para quienes buscan ayuda legal.
          </p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            :disabled="isSubmitting || content.trim() === ''"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Respuesta' }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps({
    questionId: {
      type: String,
      required: true
    },
    initialContent: {
      type: String,
      default: ''
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const content = ref(props.initialContent);
  
  const handleSubmit = () => {
    if (content.value.trim() === '') return;
    
    emit('submit', {
      content: content.value,
      questionId: props.questionId
    });
  };
  </script>