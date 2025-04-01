<template>
    <div>
      <h2 class="text-lg font-medium mb-4">Resumen de reseñas</h2>
      
      <div class="flex items-center mb-6">
        <div class="text-3xl font-bold">{{ stats.average.toFixed(1) }}</div>
        <div class="ml-2">
          <div class="flex">
            <Star 
              v-for="i in 5" 
              :key="i"
              class="w-5 h-5"
              :class="[
                i <= Math.round(stats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
              ]"
            />
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ stats.total }} {{ stats.total === 1 ? 'reseña' : 'reseñas' }}
          </div>
        </div>
      </div>
      
      <!-- Rating distribution -->
      <div class="space-y-2">
        <div v-for="n in 5" :key="n" class="flex items-center">
          <span class="w-12 text-sm text-gray-600">{{ 6 - n }} stars</span>
          <div class="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-yellow-400 rounded-full"
              :style="{ width: `${getRatingPercentage(6 - n)}%` }"
            ></div>
          </div>
          <span class="w-12 text-sm text-gray-600 text-right">
            {{ getRatingPercentage(6 - n) }}%
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Star } from 'lucide-vue-next'
  
  interface ReviewStats {
    average: number;
    total: number;
    distribution: Record<string, number>;
  }
  
  const props = defineProps<{
    stats: ReviewStats;
  }>()
  
  // Calculate percentage for each rating
  const getRatingPercentage = (rating: number): number => {
    if (!props.stats.total) return 0
    
    const count = props.stats.distribution[rating] || 0
    return Math.round((count / props.stats.total) * 100)
  }
  </script>