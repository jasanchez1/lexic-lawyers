<template>
    <div 
      class="bg-white rounded-lg shadow-sm border border-gray-200"
      :class="[
        padding ? 'p-6' : '',
        className
      ]"
    >
      <!-- Card Header -->
      <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
        <slot name="header">
          <h2 class="text-lg font-medium">{{ title }}</h2>
        </slot>
      </div>
      
      <!-- Card Body -->
      <div 
        :class="[
          !$slots.header && !title && padding ? '' : 'px-6 py-4',
          bodyClass
        ]"
      >
        <slot></slot>
      </div>
      
      <!-- Card Footer -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      default: ''
    },
    padding: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    }
  });
  </script>