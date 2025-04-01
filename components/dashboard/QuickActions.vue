<template>
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium">Acciones Rápidas</h2>
      </div>
      
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4">
          <button 
            v-for="action in actions" 
            :key="action.label"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            @click="handleAction(action.id)"
          >
            <component :is="action.icon" class="w-6 h-6 text-primary-500 mb-2" />
            <span class="text-sm text-gray-700">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    Pencil, MessageSquare, Bell, Edit,
    Settings, FileText, BarChart4, RefreshCw
  } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const actions = [
    {
      id: 'profile',
      label: 'Editar Perfil',
      icon: Pencil,
      route: '/profile'
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: MessageSquare,
      route: '/messages'
    },
    {
      id: 'questions',
      label: 'Responder Preguntas',
      icon: Edit,
      route: '/questions'
    },
    {
      id: 'stats',
      label: 'Ver Estadísticas',
      icon: BarChart4,
      route: '/statistics'
    }
  ];
  
  const handleAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action && action.route) {
      router.push(action.route);
    }
  }
  </script>