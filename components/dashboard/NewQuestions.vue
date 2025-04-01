<template>
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium">Preguntas sin Responder</h2>
      </div>
      
      <div v-if="loading" class="p-6 text-center">
        <div class="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm text-gray-500">Cargando preguntas...</p>
      </div>
      
      <div v-else-if="questions.length === 0" class="p-6 text-center">
        <p class="text-gray-500">No hay preguntas sin responder</p>
        <p class="text-sm text-gray-400 mt-1">¡Buen trabajo!</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="question in questions" 
          :key="question.id"
          class="p-4 hover:bg-gray-50"
        >
          <NuxtLink :to="`/questions/${question.id}`" class="block">
            <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">
              {{ question.title }}
            </h3>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ formatDate(question.date) }}</span>
              <span>{{ question.location }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
        <NuxtLink 
          to="/questions" 
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver todas las preguntas
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Question {
    id: string;
    title: string;
    date: string;
    location?: string;
  }
  
  const props = defineProps<{
    questions: Question[];
    loading?: boolean;
  }>()
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // If today, show 'Hoy'
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Hoy';
    }
    
    // If yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Ayer';
    }
    
    // If this week
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  }
  </script>