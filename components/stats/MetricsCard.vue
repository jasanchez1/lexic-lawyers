<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
        <div class="p-2 rounded-md" :class="iconBgClass">
          <component :is="iconComponent" class="w-5 h-5" :class="iconColorClass" />
        </div>
      </div>
      
      <div class="space-y-1">
        <div class="text-2xl font-bold">
          {{ formattedValue }}
        </div>
        
        <div v-if="previousValue !== undefined" class="flex items-center">
          <component 
            :is="trendIcon" 
            class="w-4 h-4 mr-1" 
            :class="trendColorClass"
          />
          <span 
            class="text-sm"
            :class="trendColorClass"
          >
            {{ trendPercentage }}% {{ trendDirection === 'up' ? 'más' : 'menos' }} que antes
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { 
    Eye, Users, MessageSquare, TrendingUp, TrendingDown,
    BarChart, Clock, CheckCircle, Activity, Phone
  } from 'lucide-vue-next'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    previousValue: {
      type: Number,
      default: undefined
    },
    isPercentage: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'Activity'
    }
  })
  
  // Format value with locale and handle percentages
  const formattedValue = computed(() => {
    if (props.isPercentage) {
      return `${props.value.toFixed(1)}%`
    }
    
    return props.value.toLocaleString()
  })
  
  // Calculate trend
  const trendDirection = computed(() => {
    if (props.previousValue === undefined) return null
    
    return props.value >= props.previousValue ? 'up' : 'down'
  })
  
  // Trend icon component
  const trendIcon = computed(() => {
    return trendDirection.value === 'up' ? TrendingUp : TrendingDown
  })
  
  // Calculate trend percentage
  const trendPercentage = computed(() => {
    if (props.previousValue === undefined || props.previousValue === 0) return 0
    
    const diff = props.value - props.previousValue
    const percentage = (Math.abs(diff) / props.previousValue) * 100
    
    return percentage.toFixed(1)
  })
  
  // Trend color class
  const trendColorClass = computed(() => {
    // Only show green for positive trends if they're good (avoid green for increased bounce rate, etc.)
    const isPositiveTrend = trendDirection.value === 'up'
    
    return isPositiveTrend ? 'text-green-500' : 'text-red-500'
  })
  
  // Determine icon component
  const iconComponent = computed(() => {
    const icons: Record<string, any> = {
      Eye,
      Users,
      MessageSquare,
      TrendingUp,
      BarChart,
      Clock,
      CheckCircle,
      Activity,
      Phone
    }
    
    return icons[props.icon] || Activity
  })
  
  // Icon background color
  const iconBgClass = computed(() => {
    const colors: Record<string, string> = {
      Eye: 'bg-blue-50',
      Users: 'bg-purple-50',
      MessageSquare: 'bg-green-50',
      TrendingUp: 'bg-yellow-50',
      BarChart: 'bg-blue-50',
      Clock: 'bg-orange-50',
      CheckCircle: 'bg-green-50',
      Activity: 'bg-red-50',
      Phone: 'bg-indigo-50'
    }
    
    return colors[props.icon] || 'bg-gray-50'
  })
  
  // Icon color
  const iconColorClass = computed(() => {
    const colors: Record<string, string> = {
      Eye: 'text-blue-500',
      Users: 'text-purple-500',
      MessageSquare: 'text-green-500',
      TrendingUp: 'text-yellow-500',
      BarChart: 'text-blue-500',
      Clock: 'text-orange-500',
      CheckCircle: 'text-green-500',
      Activity: 'text-red-500',
      Phone: 'text-indigo-500'
    }
    
    return colors[props.icon] || 'text-gray-500'
  })
  </script>