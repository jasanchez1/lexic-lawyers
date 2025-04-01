<template>
    <Transition name="notification">
      <div
        v-if="show"
        class="fixed right-5 bottom-5 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 z-50"
        :class="[typeClasses]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success icon -->
            <CheckCircle v-if="type === 'success'" class="h-5 w-5 text-green-500" />
            
            <!-- Info icon -->
            <Info v-else-if="type === 'info'" class="h-5 w-5 text-blue-500" />
            
            <!-- Warning icon -->
            <AlertTriangle v-else-if="type === 'warning'" class="h-5 w-5 text-amber-500" />
            
            <!-- Error icon -->
            <AlertCircle v-else-if="type === 'error'" class="h-5 w-5 text-red-500" />
          </div>
          
          <div class="ml-3 flex-1">
            <div class="flex justify-between items-center">
              <p class="text-sm font-medium" :class="[textColorClass]">
                {{ title }}
              </p>
              <button 
                @click="$emit('close')" 
                class="text-gray-400 hover:text-gray-500"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            
            <p v-if="message" class="mt-1 text-sm text-gray-600">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { 
    CheckCircle, 
    Info, 
    AlertTriangle, 
    AlertCircle,
    X 
  } from 'lucide-vue-next'
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['close'])
  
  // Compute border color based on notification type
  const typeClasses = computed(() => {
    const classes = {
      success: 'border-green-500',
      info: 'border-blue-500',
      warning: 'border-amber-500',
      error: 'border-red-500'
    }
    
    return classes[props.type as keyof typeof classes] || classes.info
  })
  
  // Compute text color for title based on notification type
  const textColorClass = computed(() => {
    const classes = {
      success: 'text-green-800',
      info: 'text-blue-800',
      warning: 'text-amber-800',
      error: 'text-red-800'
    }
    
    return classes[props.type as keyof typeof classes] || classes.info
  })
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  </style>