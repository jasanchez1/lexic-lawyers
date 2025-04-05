<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar Navigation -->
    <LayoutSidebar :collapsed="sidebarCollapsed" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col ml-64" :class="{ 'ml-20': sidebarCollapsed }">
      <LayoutHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="flex-1 p-6">
        <slot />
      </main>
      
      <LayoutFooter />
    </div>

    <!-- Notifications -->
    <UiNotification
      v-if="notification.show"
      :show="notification.show"
      :type="notification.type"
      :title="notification.title || ''"
      :message="notification.message"
      @close="closeNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const sidebarCollapsed = ref(false)
const { notification, closeNotification } = useNotifications()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>