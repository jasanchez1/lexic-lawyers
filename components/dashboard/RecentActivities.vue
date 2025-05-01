<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-medium">Actividad Reciente</h2>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2">
      </div>
      <p class="text-sm text-gray-500">Cargando actividades...</p>
    </div>

    <div v-else-if="activities.length === 0" class="p-6 text-center">
      <p class="text-gray-500">No hay actividades recientes</p>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div v-for="(activity, index) in activities" :key="index" class="px-6 py-4 flex items-start">
        <!-- Activity icon -->
        <div class="mr-4">
          <div class="p-2 rounded-full" :class="getActivityIconClass(activity.type)">
            <component :is="getActivityIcon(activity.type)" class="w-4 h-4"
              :class="getActivityIconColor(activity.type)" />
          </div>
        </div>

        <!-- Activity content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            {{ activity.description }}
          </p>
        </div>

        <!-- Action button if available -->
        <div v-if="activity.actionUrl" class="ml-4">
          <NuxtLink :to="activity.actionUrl" class="text-sm text-primary-600 hover:text-primary-700">
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
  MessageCircle, Eye, Clock, AlertCircle
} from 'lucide-vue-next'

interface Activity {
  type: 'message' | 'view' | 'impression' | 'click';
  description: string;
  timestamp: string;
  actionUrl?: string;
}

const props = defineProps<{
  activities: Activity[];
  loading?: boolean;
}>()

// Get activity icon
const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    message: MessageCircle,
    view: Eye,
    impression: Eye,
    click: Clock
  }

  return icons[type] || AlertCircle
}

// Get activity icon background class
const getActivityIconClass = (type: string) => {
  const classes: Record<string, string> = {
    message: 'bg-green-50',
    view: 'bg-blue-50',
    impression: 'bg-yellow-50',
    click: 'bg-purple-50'
  }

  return classes[type] || 'bg-gray-50'
}

// Get activity icon color
const getActivityIconColor = (type: string) => {
  const colors: Record<string, string> = {
    message: 'text-green-500',
    view: 'text-blue-500',
    impression: 'text-yellow-500',
    click: 'text-purple-500'
  }

  return colors[type] || 'text-gray-500'
}
</script>