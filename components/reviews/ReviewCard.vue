<template>
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="p-6">
        <!-- Review header with rating -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center">
              <div class="flex">
                <Star 
                  v-for="i in 5" 
                  :key="i"
                  class="w-5 h-5"
                  :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'"
                />
              </div>
              <span class="ml-2 text-gray-600">{{ review.rating }}/5</span>
            </div>
            
            <h3 class="text-lg font-medium mt-2">{{ review.title }}</h3>
          </div>
          
          <div class="flex items-center">
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="review.hasReply ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            >
              {{ review.hasReply ? 'Respondida' : 'Sin responder' }}
            </span>
          </div>
        </div>
        
        <!-- Review content -->
        <div class="prose prose-sm max-w-none mb-4">
          <p>{{ review.content }}</p>
        </div>
        
        <!-- Review meta -->
        <div class="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div class="flex items-center gap-4">
            <span>{{ review.author }}</span>
            <span>{{ formatDate(review.date) }}</span>
            <span v-if="review.isVerifiedClient" class="flex items-center text-green-600">
              <CheckCircle class="w-4 h-4 mr-1" />
              Cliente Verificado
            </span>
          </div>
          
          <button 
            v-if="!review.hasReply"
            @click="$emit('reply', review)"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Responder
          </button>
        </div>
        
        <!-- Review reply if any -->
        <div 
          v-if="review.reply"
          class="mt-4 pt-4 border-t border-gray-100 bg-gray-50 p-4 rounded-md"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center"
            >
              {{ review.reply.author.charAt(0) }}
            </div>
            
            <div class="flex-1">
              <div class="flex items-baseline justify-between">
                <p class="font-medium">{{ review.reply.author }}</p>
                <span class="text-xs text-gray-500">{{ formatDate(review.reply.date) }}</span>
              </div>
              
              <div class="prose prose-sm max-w-none mt-1">
                <p>{{ review.reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Star, CheckCircle } from 'lucide-vue-next'
  
  interface ReviewReply {
    id: string;
    content: string;
    date: string;
    author: string;
  }
  
  interface Review {
    id: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    author: string;
    isVerifiedClient?: boolean;
    hasReply?: boolean;
    reply?: ReviewReply;
  }
  
  const props = defineProps<{
    review: Review;
  }>()
  
  defineEmits(['reply'])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }
  </script>