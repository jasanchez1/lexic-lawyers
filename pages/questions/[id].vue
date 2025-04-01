<template>
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6">
        <!-- Question header -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {{ question.title }}
            </h2>
            <div class="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
              <span>{{ formatDate(question.date) }}</span>
              <span v-if="question.location">{{ question.location }}</span>
              <span>Vistas: {{ question.viewCount }}</span>
              <span>Respuestas: {{ question.answerCount }}</span>
            </div>
          </div>
          
          <div class="flex items-center">
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="statusClass"
            >
              {{ statusText }}
            </span>
          </div>
        </div>
        
        <!-- Question content -->
        <div class="prose prose-sm max-w-none mb-6">
          <p>{{ question.content }}</p>
        </div>
        
        <!-- Question tags/topics -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="topic in question.topics" 
            :key="topic.id"
            class="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
          >
            {{ topic.name }}
          </span>
        </div>
        
        <!-- Question actions -->
        <div class="flex justify-end">
          <button
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            @click="$emit('answer', question.id)"
          >
            {{ question.answerCount > 0 ? 'Ver respuestas' : 'Responder' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Topic {
    id: string;
    name: string;
    slug: string;
  }
  
  interface Question {
    id: string;
    title: string;
    content: string;
    date: string;
    location?: string;
    viewCount: number;
    answerCount: number;
    topics: Topic[];
    status?: 'answered' | 'unanswered' | 'accepted';
  }
  
  const props = defineProps<{
    question: Question;
  }>()
  
  defineEmits(['answer'])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format: 12 de mayo de 2023
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
  
  // Compute question status
  const statusText = computed(() => {
    if (props.question.status === 'accepted') return 'Respuesta aceptada';
    if (props.question.answerCount > 0) return 'Respondida';
    return 'Sin responder';
  })
  
  // Compute status class
  const statusClass = computed(() => {
    if (props.question.status === 'accepted') return 'bg-green-100 text-green-800';
    if (props.question.answerCount > 0) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  })
  </script>