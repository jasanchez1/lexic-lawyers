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
      </div>
      
      <!-- Review content -->
      <div class="prose prose-sm max-w-none mb-4">
        <p>{{ review.content }}</p>
      </div>
      
      <!-- Review meta -->
      <div class="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t pt-4">
        <div class="flex items-center gap-4">
          <span>{{ review.author.name }}</span>
          <span>{{ review.author.email }}</span>
          <span>{{ formatDate(review.date) }}</span>
          <span v-if="review.isVerifiedClient" class="flex items-center text-green-600">
            <CheckCircle class="w-4 h-4 mr-1" />
            Cliente Verificado
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, CheckCircle } from 'lucide-vue-next'

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  author: string;
  isVerifiedClient?: boolean;
}

const props = defineProps<{
  review: Review;
}>()

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