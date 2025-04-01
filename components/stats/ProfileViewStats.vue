<template>
    <div class="space-y-6">
      <!-- Click-through Rate -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-gray-700 font-medium">Tasa de clics</h3>
          <span class="text-lg font-bold">{{ clickThroughRate.toFixed(1) }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            class="bg-primary-500 h-2.5 rounded-full"
            :style="{ width: `${clickThroughRate}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Porcentaje de usuarios que hacen clic en tu perfil después de verlo en resultados de búsqueda.</p>
      </div>
      
      <!-- Average View Time -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-gray-700 font-medium">Tiempo promedio de vista</h3>
          <span class="text-lg font-bold">{{ formatTime(averageViewTime) }}</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            class="bg-green-500 h-2.5 rounded-full"
            :style="{ width: `${Math.min((averageViewTime / 120) * 100, 100)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Tiempo promedio que los usuarios pasan en tu perfil.</p>
      </div>
      
      <!-- Contact Rate -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-gray-700 font-medium">Tasa de contacto</h3>
          <span class="text-lg font-bold">{{ contactRate.toFixed(1) }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            class="bg-yellow-400 h-2.5 rounded-full"
            :style="{ width: `${contactRate}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Porcentaje de visitantes que te contactan después de ver tu perfil.</p>
      </div>
      
      <!-- Tips -->
      <div class="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <p class="font-medium mb-2">Consejos para mejorar tu rendimiento:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Mantén tu perfil actualizado con información clara y precisa.</li>
          <li>Responde a las consultas lo más rápido posible.</li>
          <li>Añade más detalles sobre tus áreas de práctica y experiencia.</li>
          <li>Solicita reseñas a tus clientes satisfechos.</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    clickThroughRate: {
      type: Number,
      default: 0
    },
    averageViewTime: {
      type: Number,
      default: 0
    },
    contactRate: {
      type: Number,
      default: 0
    }
  })
  
  // Format time in seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  </script>