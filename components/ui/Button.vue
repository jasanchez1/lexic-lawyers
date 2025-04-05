<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      class="inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
      :class="[
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        fullWidth ? 'w-full' : '',
        className
      ]"
      @click="$emit('click', $event)"
    >
      <!-- Loading spinner -->
      <span v-if="loading" class="mr-2">
        <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
      </span>
      
      <!-- Left icon -->
      <component
        v-if="icon && iconPosition === 'left'"
        :is="icon"
        :class="iconClasses"
      ></component>
      
      <!-- Button content -->
      <slot></slot>
      
      <!-- Right icon -->
      <component
        v-if="icon && iconPosition === 'right'"
        :is="icon"
        :class="iconClasses"
      ></component>
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'light', 'dark', 'link',
        'outline-primary', 'outline-secondary', 'outline-success',
        'outline-danger', 'outline-warning', 'outline-info',
        'outline-light', 'outline-dark'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (value: string) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    icon: {
      type: [Object, Function],
      default: null
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value)
    },
    className: {
      type: String,
      default: ''
    }
  });
  
  defineEmits(['click']);
  
  // Define variant classes
  const variantClasses = {
    'primary': 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    'secondary': 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    'success': 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    'danger': 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    'warning': 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    'info': 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    'light': 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500',
    'dark': 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500',
    'link': 'bg-transparent hover:bg-gray-50 text-primary-600 hover:text-primary-800',
    'outline-primary': 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    'outline-secondary': 'bg-transparent border border-secondary-600 text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500',
    'outline-success': 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    'outline-danger': 'bg-transparent border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    'outline-warning': 'bg-transparent border border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
    'outline-info': 'bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    'outline-light': 'bg-transparent border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    'outline-dark': 'bg-transparent border border-gray-800 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  // Define size classes
  const sizeClasses = {
    'sm': 'px-2.5 py-1.5 text-xs',
    'md': 'px-4 py-2 text-sm',
    'lg': 'px-5 py-2.5 text-base',
    'xl': 'px-6 py-3 text-lg'
  };
  
  // Define rounded classes
  const roundedClasses = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-full'
  };
  
  // Define icon classes
  const iconClasses = computed(() => {
    return {
      'w-4 h-4': props.size === 'sm',
      'w-5 h-5': props.size === 'md',
      'w-6 h-6': props.size === 'lg' || props.size === 'xl',
      'mr-2': props.iconPosition === 'left' && props.size !== 'sm',
      'mr-1': props.iconPosition === 'left' && props.size === 'sm',
      'ml-2': props.iconPosition === 'right' && props.size !== 'sm',
      'ml-1': props.iconPosition === 'right' && props.size === 'sm'
    };
  });
  </script>