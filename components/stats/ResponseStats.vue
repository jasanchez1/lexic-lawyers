<template>
    <div class="space-y-6">
      <!-- Response Time -->
      <div>
        <div class="mb-2">
          <h3 class="text-gray-700 font-medium">Tiempo de respuesta promedio</h3>
          <div class="flex justify-between items-baseline mt-1">
            <div>
              <span class="text-2xl font-bold">{{ formatHours(responseTime) }}</span>
              <span class="text-sm text-gray-500 ml-1">horas</span>
            </div>
            <div class="text-sm" :class="responseTimeComparisonClass">
              {{ responseTimeComparisonText }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex-1">
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                class="h-2.5 rounded-full"
                :class="responseTimeBarClass"
                :style="{ width: `${responseTimePercentage}%` }"
              ></div>
            </div>
          </div>
          <div class="text-xs text-gray-500">Industria: {{ formatHours(industryAvgTime) }}h</div>
        </div>
      </div>
      
      <!-- Response Rate -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-gray-700 font-medium">Tasa de respuesta</h3>
          <span class="text-lg font-bold">{{ responseRate.toFixed(0) }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            :class="[responseRate >= 90 ? 'bg-green-500' : responseRate >= 75 ? 'bg-yellow-400' : 'bg-red-500']"
            class="h-2.5 rounded-full"
            :style="{ width: `${responseRate}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Porcentaje de mensajes que respondes.</p>
      </div>
      
      <!-- Benchmark Comparison -->
      <div class="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 class="font-medium mb-2">Comparación con el promedio de la industria</h3>
        
        <table class="w-full text-sm">
          <thead>
            <tr>
              <th class="text-left font-medium text-gray-500 py-2">Métrica</th>
              <th class="text-right font-medium text-gray-500 py-2">Tú</th>
              <th class="text-right font-medium text-gray-500 py-2">Industria</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="py-2">Tiempo de respuesta</td>
              <td class="text-right font-medium">{{ formatHours(responseTime) }}h</td>
              <td class="text-right">{{ formatHours(industryAvgTime) }}h</td>
            </tr>
            <tr>
              <td class="py-2">Tasa de respuesta</td>
              <td class="text-right font-medium">{{ responseRate.toFixed(0) }}%</td>
              <td class="text-right">85%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps({
    responseTime: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    },
    industryAvgTime: {
      type: Number,
      default: 0
    }
  })
  
  // Format hours with 1 decimal place
  const formatHours = (hours: number) => {
    return hours.toFixed(1)
  }
  
  // Calculate percentage for response time bar
  const responseTimePercentage = computed(() => {
    // For response time, lower is better
    // We'll invert the percentage so a lower time gives a higher percentage
    // We'll cap it at 24 hours (100%)
    
    const maxHours = 24
    const percentage = 100 - ((props.responseTime / maxHours) * 100)
    
    return Math.min(Math.max(percentage, 0), 100)
  })
  
  // Determine response time bar color
  const responseTimeBarClass = computed(() => {
    if (props.responseTime <= props.industryAvgTime * 0.8) {
      return 'bg-green-500' // Much better than industry average
    } else if (props.responseTime <= props.industryAvgTime) {
      return 'bg-green-400' // Better than industry average
    } else if (props.responseTime <= props.industryAvgTime * 1.2) {
      return 'bg-yellow-400' // Slightly worse than industry average
    } else {
      return 'bg-red-500' // Much worse than industry average
    }
  })
  
  // Comparison text for response time
  const responseTimeComparisonText = computed(() => {
    const diff = props.industryAvgTime - props.responseTime
    const percentage = Math.abs((diff / props.industryAvgTime) * 100).toFixed(0)
    
    if (Math.abs(diff) < 0.5) {
      return 'Similar al promedio'
    } else if (diff > 0) {
      return `${percentage}% más rápido que el promedio`
    } else {
      return `${percentage}% más lento que el promedio`
    }
  })
  
  // Comparison text color
  const responseTimeComparisonClass = computed(() => {
    const diff = props.industryAvgTime - props.responseTime
    
    if (Math.abs(diff) < 0.5) {
      return 'text-gray-500'
    } else if (diff > 0) {
      return 'text-green-500'
    } else {
      return 'text-red-500'
    }
  })
  </script>