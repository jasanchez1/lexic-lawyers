<template>
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">{{ title }}</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
  
        <!-- Modal Content -->
        <div>
          <slot></slot>
        </div>
  
        <!-- Modal Footer -->
        <div v-if="showFooter" class="mt-6 flex justify-end space-x-3">
          <button
            v-if="showCancel"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="showConfirm"
            @click="$emit('confirm')"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Modal',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: 'Cancelar',
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
  });
  
  defineEmits(['close', 'confirm']);
  </script>