<template>
  <aside
    class="fixed h-full left-0 top-0 bg-primary-800 text-white transition-all duration-300 z-10"
    :class="[collapsed ? 'w-20' : 'w-64']"
  >
    <div class="h-16 flex items-center px-4 border-b border-primary-700">
      <div v-if="!collapsed" class="text-xl font-bold text-white">Lexic</div>
      <div v-else class="text-xl font-bold text-white w-full text-center">L</div>
    </div>

    <nav class="mt-6 px-4">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <NuxtLink
            to="/"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <HomeIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Questions -->
        <li>
          <NuxtLink
            to="/questions"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <HelpCircleIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Preguntas</span>
          </NuxtLink>
        </li>

        <!-- Reviews -->
        <li>
          <NuxtLink
            to="/reviews"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <StarIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Reseñas</span>
          </NuxtLink>
        </li>

        <!-- Messages -->
        <li>
          <NuxtLink
            to="/messages"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <MessageCircleIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Mensajes</span>
          </NuxtLink>
        </li>

        <!-- Statistics -->
        <li>
          <NuxtLink
            to="/statistics"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <BarChartIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Estadísticas</span>
          </NuxtLink>
        </li>

        <!-- Profile -->
        <li>
          <NuxtLink
            to="/profile"
            class="flex items-center p-3 rounded-md hover:bg-primary-700 transition-colors"
            :class="{ 'justify-center': collapsed }"
          >
            <UserIcon class="w-5 h-5" />
            <span v-if="!collapsed" class="ml-3">Perfil</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  Home as HomeIcon,
  HelpCircle as HelpCircleIcon,
  Star as StarIcon,
  MessageCircle as MessageCircleIcon,
  BarChart as BarChartIcon,
  User as UserIcon
} from 'lucide-vue-next'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed'])
</script>