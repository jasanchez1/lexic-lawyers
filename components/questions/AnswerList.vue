<template>
    <div class="space-y-6">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Cargando respuestas...</p>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="answers.length === 0" class="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p class="text-gray-500 mb-2">Aún no hay respuestas para esta pregunta.</p>
        <p class="text-sm text-gray-400">¡Sé el primero en responder!</p>
      </div>
      
      <!-- Answers list -->
      <div v-else>
        <h2 class="text-xl font-bold mb-4">{{ answers.length }} {{ answers.length === 1 ? 'Respuesta' : 'Respuestas' }}</h2>
        
        <div class="space-y-6">
          <QuestionsAnswerCard
            v-for="answer in answers"
            :key="answer.id"
            :answer="answer"
            :is-own-answer="isOwnAnswer(answer)"
            :show-reply-form="replyingToId === answer.id"
            @reply="handleReply(answer.id)"
            @edit="$emit('edit', answer)"
            @delete="$emit('delete', answer.id)"
            @submit-reply="handleSubmitReply"
            @cancel-reply="replyingToId = null"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  
  const props = defineProps({
    answers: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['edit', 'delete', 'reply']);
  
  const { user } = useAuth();
  const replyingToId = ref(null);
  
  const isOwnAnswer = (answer: any) => {
    if (!user.value) return false;
    
    // Check if the answer is from the current logged in lawyer
    if (answer.lawyer_id && user.value.lawyer_id) {
      return answer.lawyer_id === user.value.lawyer_id;
    }
    
    // Fallback to user ID comparison
    return answer.user_id === user.value.id;
  };
  
  const handleReply = (answerId: string) => {
    replyingToId.value = answerId;
  };
  
  const handleSubmitReply = (data: any) => {
    emit('reply', data);
    replyingToId.value = null;
  };
  </script>