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
        <!-- Notifications -->
        <div class="relative mr-4">
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell class="w-6 h-6" />
            <span
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full"
            >
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>
        </div>

        <!-- User Dropdown -->
        <div class="relative" ref="userMenuRef">
          <button
            class="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <div
              class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2"
            >
              {{ userInitials }}
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Menu, Bell, ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { useAuth } from '~/composables/useAuth'
import { useNotifications } from '~/composables/useNotifications'

const emit = defineEmits(['toggle-sidebar'])
const userMenuRef = ref(null)
const isUserMenuOpen = ref(false)
const { user, logout } = useAuth()
const { unreadCount: unreadNotifications } = useNotifications()

// Close dropdown when clicking outside
onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
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
</script>