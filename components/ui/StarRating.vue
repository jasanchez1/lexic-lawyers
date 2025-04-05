<template>
    <div class="flex items-center">
      <div class="flex">
        <button
          v-for="i in maxValue"
          :key="i"
          type="button"
          class="focus:outline-none"
          :class="{ 'cursor-pointer': interactive }"
          @click="handleClick(i)"
          @mouseover="interactive ? (hoverValue = i) : null"
          @mouseout="interactive ? (hoverValue = 0) : null"
        >
          <Star
            class="h-5 w-5"
            :class="[
              getStarClasses(i),
              interactive && hoverValue >= i ? 'text-yellow-400 fill-yellow-400' : ''
            ]"
          />
        </button>
      </div>
      <span v-if="showValue" class="ml-2 text-sm text-gray-600">{{ displayValue }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Star } from 'lucide-vue-next';
  
  const props = defineProps({
    value: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 5
    },
    interactive: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator: (val: string) => ['sm', 'md', 'lg'].includes(val)
    }
  });
  
  const emit = defineEmits(['update:value', 'change']);
  
  // State for hover effect
  const hoverValue = ref(0);
  
  // Computed value to display
  const displayValue = computed(() => {
    return props.value.toFixed(1);
  });
  
  // Click handler for interactive mode
  const handleClick = (rating: number) => {
    if (props.interactive) {
      emit('update:value', rating);
      emit('change', rating);
    }
  };
  
  // Get star classes based on value and index
  const getStarClasses = (index: number) => {
    if (index <= props.value) {
      return 'text-yellow-400 fill-yellow-400';
    }
    // Handle partial stars (e.g., 3.5 stars)
    if (index - 0.5 <= props.value) {
      return 'text-yellow-400 fill-yellow-400 half-filled';
    }
    return 'text-gray-300 fill-gray-300';
  };
  </script>
  
  <style scoped>
  /* Custom style for half-filled stars if needed */
  .half-filled {
    background: linear-gradient(to right, #FBBF24 50%, #D1D5DB 50%);
    background-clip: text;
    -webkit-background-clip: text;
  }
  </style>