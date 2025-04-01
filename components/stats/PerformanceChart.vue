<template>
    <div>
      <div v-if="!ready" class="flex items-center justify-center h-60">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <canvas v-else ref="chartRef" height="250"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import Chart from 'chart.js/auto'
  
  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value: string) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
    },
    yAxis: {
      type: String,
      default: ''
    },
    colors: {
      type: Array,
      default: () => ['#3975db', '#90EE90', '#FFD700', '#FF6B6B', '#9370DB']
    }
  })
  
  const chartRef = ref<HTMLCanvasElement | null>(null)
  const chart = ref<Chart | null>(null)
  const ready = ref(false)
  
  // Initialize chart
  const initChart = async () => {
    if (!chartRef.value) return
    
    // Destroy any existing chart
    if (chart.value) {
      chart.value.destroy()
    }
    
    // Set chart options based on chart type
    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
    }
    
    // Add specific options for line and bar charts
    if (props.type === 'line' || props.type === 'bar') {
      options.scales = {
        y: {
          beginAtZero: true,
          title: {
            display: !!props.yAxis,
            text: props.yAxis
          }
        }
      }
    }
    
    // Create new chart
    chart.value = new Chart(chartRef.value, {
      type: props.type,
      data: props.data,
      options
    })
    
    // Mark as ready
    ready.value = true
  }
  
  // Watch for data changes
  watch(() => props.data, async () => {
    // Wait for next tick to ensure the DOM is updated
    await nextTick()
    initChart()
  }, { deep: true })
  
  // Initialize on mount
  onMounted(async () => {
    // Use setTimeout to ensure the canvas is rendered
    setTimeout(() => {
      initChart()
    }, 100)
  })
  </script>