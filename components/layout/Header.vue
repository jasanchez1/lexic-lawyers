<template>
  <header class="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-10 ml-64">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Left side with toggle button -->
      <div class="flex items-center">
        <button
          @click="$emit('toggle-sidebar')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- Right side with user info -->
      <div class="flex items-center">
        <!-- Notifications / Recent Activity -->
        <div class="relative mr-4">
          <button 
            @click="toggleNotifications" 
            class="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Bell class="w-6 h-6" />
          </button>
          
          <!-- Activity Dropdown -->
          <div 
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-100 z-50"
          >
            <div class="p-2">
              <div class="border-b pb-2 mb-2 px-3 py-2 flex justify-between items-center">
                <p class="text-sm font-medium">Actividad Reciente</p>
              </div>
              
              <div v-if="isLoading" class="py-4 text-center">
                <div class="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p class="text-sm text-gray-500">Cargando actividades...</p>
              </div>
              
              <div v-else-if="activities.length === 0" class="py-4 text-center text-gray-500 text-sm">
                No hay actividad reciente
              </div>
              
              <div v-else class="max-h-80 overflow-y-auto">
                <button
                  v-for="(activity, index) in activities"
                  :key="index"
                  @click="handleActivityClick(activity)"
                  class="w-full px-3 py-2 hover:bg-gray-50 text-left transition-colors rounded-md flex items-start gap-3"
                >
                  <div :class="getActivityIconClass(activity.type)" class="p-2 rounded-full mt-0.5">
                    <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm">
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatTime(activity.timestamp) }}
                    </p>
                  </div>
                </button>
              </div>
              
              <div class="border-t pt-2 mt-2 px-3 py-2 text-center">
                <NuxtLink to="/" class="text-xs text-primary-600 hover:text-primary-800">
                  Ver toda la actividad en el dashboard
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- User Dropdown -->
        <div class="relative" ref="userMenuRef">
          <button
            class="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <div class="w-8 h-8 rounded-full mr-2 overflow-hidden">
              <img 
                v-if="lawyerProfile?.image_url" 
                :src="lawyerProfile.image_url" 
                :alt="`Foto de perfil de ${user?.first_name || 'Usuario'}`"
                class="w-full h-full object-cover"
                @error="onImageError"
              />
              <div
                v-else
                class="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600"
              >
                {{ userInitials }}
              </div>
            </div>
            <span class="mr-1">{{ user?.first_name || 'Usuario' }}</span>
            <ChevronDown
              :class="{ 'rotate-180': isUserMenuOpen }"
              class="w-4 h-4 transition-transform"
            />
          </button>

          <!-- User Dropdown Menu -->
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50"
          >
            <div class="p-2">
              <div class="border-b pb-2 mb-2 px-3 py-2">
                <p class="text-sm font-medium">{{ user?.email }}</p>
              </div>
              <NuxtLink
                to="/profile"
                class="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                @click="isUserMenuOpen = false"
              >
                Mi Perfil
              </NuxtLink>
              <button
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md transition-colors duration-200"
                @click="handleLogout"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Menu, Bell, ChevronDown, MessageCircle, Eye, AlertCircle, Clock } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useAuth } from '~/composables/useAuth'
import { useRecentActivity } from '~/composables/useRecentActivity'

const emit = defineEmits(['toggle-sidebar'])
const userMenuRef = ref(null)
const isUserMenuOpen = ref(false)
const { user, lawyerProfile, logout } = useAuth()

// Get real activity data
const { activities, isLoading, fetchRecentActivity } = useRecentActivity()

// Load activities on mount
onMounted(() => {
  fetchRecentActivity()
})

// Notifications state
const showNotifications = ref(false)

// Toggle notifications dropdown
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  
  // Close user menu if open
  if (showNotifications.value && isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
  
  // Refresh activities when opening
  if (showNotifications.value) {
    fetchRecentActivity()
  }
}

// Handle activity click
const handleActivityClick = (activity: any) => {
  // Close dropdown
  showNotifications.value = false
  
  // Navigate to link if available
  if (activity.actionUrl) {
    navigateTo(activity.actionUrl)
  }
}

// Format time
const formatTime = (timestamp: any) => {
  const date = new Date(timestamp)
  
  // If today, show only time
  const today = new Date()
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Hoy, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // If yesterday
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Ayer, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // If this week
  const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString([], { weekday: 'long' }) + ', ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Otherwise show full date
  return date.toLocaleDateString() + ', ' + 
         date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Get activity icon
const getActivityIcon = (type: string) => {
  const icons = {
    message: MessageCircle,
    view: Eye,
    impression: Eye,
    click: Clock
  }
  
  return icons[type as keyof typeof icons] || AlertCircle
}

// Get activity icon background class
const getActivityIconClass = (type: string) => {
  const classes = {
    message: 'bg-green-50 text-green-600',
    view: 'bg-blue-50 text-blue-600',
    impression: 'bg-yellow-50 text-yellow-600',
    click: 'bg-purple-50 text-purple-600'
  }
  
  return classes[type as keyof typeof classes] || 'bg-gray-50 text-gray-600'
}

// Close dropdowns when clicking outside
onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
  showNotifications.value = false
})

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return '?'

  const firstName = user.value.first_name || ''
  const lastName = user.value.last_name || ''

  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()

  return firstInitial + (lastInitial || '')
})

// Handle logout
const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

// Handle image loading error
const onImageError = (event: any) => {
  // Hide the image and show initials fallback
  event.target.style.display = 'none'
}
</script>