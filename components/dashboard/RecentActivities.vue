<template>
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium">Actividad Reciente</h2>
      </div>
      
      <div v-if="loading" class="p-6 text-center">
        <div class="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm text-gray-500">Cargando actividades...</p>
      </div>
      
      <div v-else-if="activities.length === 0" class="p-6 text-center">
        <p class="text-gray-500">No hay actividades recientes</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="(activity, index) in activities" 
          :key="index"
          class="px-6 py-4 flex items-start"
        >
          <!-- Activity icon -->
          <div class="mr-4">
            <div class="p-2 rounded-full" :class="getActivityIconClass(activity.type)">
              <component 
                :is="getActivityIcon(activity.type)" 
                class="w-4 h-4" 
                :class="getActivityIconColor(activity.type)" 
              />
            </div>
          </div>
          
          <!-- Activity content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatTime(activity.timestamp) }}
            </p>
          </div>
          
          <!-- Action button if available -->
          <div v-if="activity.actionUrl" class="ml-4">
            <NuxtLink 
              :to="activity.actionUrl" 
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              Ver
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
        <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Ver todas las actividades
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    MessageCircle, Eye, Star, User, Clock, 
    Check, AlertCircle, HelpCircle 
  } from 'lucide-vue-next'
  
  interface Activity {
    type: 'message' | 'view' | 'review' | 'question' | 'answer' | 'contact' | 'system';
    description: string;
    timestamp: string;
    actionUrl?: string;
  }
  
  const props = defineProps<{
    activities: Activity[];
    loading?: boolean;
  }>()
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    // If today, show only time
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Hoy, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Ayer, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'long' }) + ', ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString() + ', ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Get activity icon
  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      message: MessageCircle,
      view: Eye,
      review: Star,
      question: HelpCircle, 
      answer: Check,
      contact: User,
      system: AlertCircle
    }
    
    return icons[type] || Clock;
  }
  
  // Get activity icon background class
  const getActivityIconClass = (type: string) => {
    const classes: Record<string, string> = {
      message: 'bg-green-50',
      view: 'bg-blue-50',
      review: 'bg-yellow-50',
      question: 'bg-purple-50',
      answer: 'bg-primary-50',
      contact: 'bg-indigo-50',
      system: 'bg-red-50'
    }
    
    return classes[type] || 'bg-gray-50';
  }
  
  // Get activity icon color
  const getActivityIconColor = (type: string) => {
    const colors: Record<string, string> = {
      message: 'text-green-500',
      view: 'text-blue-500',
      review: 'text-yellow-500',
      question: 'text-purple-500',
      answer: 'text-primary-500',
      contact: 'text-indigo-500',
      system: 'text-red-500'
    }
    
    return colors[type] || 'text-gray-500';
  }
  </script>