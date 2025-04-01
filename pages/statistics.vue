<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Estadísticas</h1>
      
      <!-- Date Range Selector -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div class="flex flex-wrap items-center justify-between">
          <h2 class="text-lg font-medium mb-2 md:mb-0">Rango de Fechas</h2>
          
          <div class="flex items-center space-x-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="setDateRange(period.value)"
              class="px-3 py-1.5 text-sm rounded-md"
              :class="[
                selectedPeriod === period.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ period.label }}
            </button>
            
            <button
              class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              @click="customDateRange = !customDateRange"
            >
              Personalizado
            </button>
          </div>
        </div>
        
        <!-- Custom Date Range -->
        <div v-if="customDateRange" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              id="startDate"
              v-model="dateRange.start"
              type="date"
              class="form-input"
              :max="dateRange.end"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              id="endDate"
              v-model="dateRange.end"
              type="date"
              class="form-input"
              :min="dateRange.start"
            />
          </div>
          
          <button
            @click="applyCustomDateRange"
            class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 md:col-span-2"
          >
            Aplicar
          </button>
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsMetricsCard
          title="Vistas de Perfil"
          :value="stats.profileViews"
          :previousValue="stats.previousProfileViews"
          icon="Eye"
        />
        <StatsMetricsCard
          title="Impresiones"
          :value="stats.impressions"
          :previousValue="stats.previousImpressions"
          icon="Users"
        />
        <StatsMetricsCard
          title="Contactos"
          :value="stats.contacts"
          :previousValue="stats.previousContacts"
          icon="MessageSquare"
        />
        <StatsMetricsCard
          title="Tasa de Conversión"
          :value="stats.conversionRate"
          :previousValue="stats.previousConversionRate"
          isPercentage
          icon="TrendingUp"
        />
      </div>
      
      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Profile Views Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Vistas de Perfil</h2>
          <StatsPerformanceChart 
            :data="profileViewsChartData"
            type="line"
            yAxis="Vistas"
          />
        </div>
        
        <!-- Traffic Sources Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Fuentes de Tráfico</h2>
          <StatsPerformanceChart 
            :data="trafficSourcesChartData"
            type="pie"
            :colors="['#3975db', '#90EE90', '#FFD700', '#FF6B6B', '#9370DB']"
          />
        </div>
      </div>
      
      <!-- Performance Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Response Time -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Tiempo de Respuesta</h2>
          <StatsResponseStats 
            :responseTime="stats.responseTime"
            :responseRate="stats.responseRate"
            :industryAvgTime="stats.industryAvgResponseTime"
          />
        </div>
        
        <!-- Profile View Stats -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Rendimiento de Perfil</h2>
          <StatsProfileViewStats 
            :clickThroughRate="stats.clickThroughRate"
            :averageViewTime="stats.averageViewTime"
            :contactRate="stats.contactRate"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useStatsService } from '~/services/stats-service'
  
  definePageMeta({
    middleware: ['lawyer-auth']
  })
  
  // Date range state
  const customDateRange = ref(false)
  const selectedPeriod = ref('week')
  const dateRange = ref({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  })
  
  // Predefined periods
  const periods = [
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
    { label: 'Trimestre', value: 'quarter' },
    { label: 'Año', value: 'year' }
  ]
  
  // Statistics
  const statsService = useStatsService()
  const isLoading = ref(false)
  const error = ref(null)
  const stats = ref({
    profileViews: 0,
    previousProfileViews: 0,
    impressions: 0,
    previousImpressions: 0,
    contacts: 0,
    previousContacts: 0,
    conversionRate: 0,
    previousConversionRate: 0,
    responseTime: 0,
    responseRate: 0,
    industryAvgResponseTime: 0,
    clickThroughRate: 0,
    averageViewTime: 0,
    contactRate: 0
  })
  
  // Charts data
  const profileViewsChartData = ref({
    labels: [],
    datasets: []
  })
  
  const trafficSourcesChartData = ref({
    labels: [],
    datasets: []
  })
  
  // Set date range based on predefined period
  const setDateRange = (period: string) => {
    selectedPeriod.value = period
    const end = new Date()
    let start = new Date()
    
    switch (period) {
      case 'week':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate())
        break
      case 'quarter':
        start = new Date(end.getFullYear(), end.getMonth() - 3, end.getDate())
        break
      case 'year':
        start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate())
        break
    }
    
    dateRange.value.start = start.toISOString().slice(0, 10)
    dateRange.value.end = end.toISOString().slice(0, 10)
    
    // Fetch stats with the new date range
    fetchStats()
  }
  
  // Apply custom date range
  const applyCustomDateRange = () => {
    selectedPeriod.value = 'custom'
    customDateRange.value = false
    
    // Fetch stats with the custom date range
    fetchStats()
  }
  
  // Fetch statistics
  const fetchStats = async () => {
    isLoading.value = true
    
    try {
      // In a real app, send the date range to the API
      const params = {
        start_date: dateRange.value.start,
        end_date: dateRange.value.end
      }
      
      // For now, use mock data
      const response = await statsService.getProfileStats(selectedPeriod.value)
      
      // Update stats
      stats.value = response || stats.value
      
      // Update chart data
      updateChartData(response)
    } catch (err) {
      console.error('Error fetching stats:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas'
    } finally {
      isLoading.value = false
    }
  }
  
  // Update chart data
  const updateChartData = (data: any) => {
    // Profile views chart data
    if (data.profileViewsChart) {
      profileViewsChartData.value = {
        labels: data.profileViewsChart.labels,
        datasets: [
          {
            label: 'Vistas de Perfil',
            data: data.profileViewsChart.data,
            borderColor: '#3975db',
            backgroundColor: 'rgba(57, 117, 219, 0.1)',
            tension: 0.4
          }
        ]
      }
    }
    
    // Traffic sources chart data
    if (data.trafficSources) {
      trafficSourcesChartData.value = {
        labels: data.trafficSources.map((source: any) => source.name),
        datasets: [
          {
            data: data.trafficSources.map((source: any) => source.value),
            backgroundColor: ['#3975db', '#90EE90', '#FFD700', '#FF6B6B', '#9370DB']
          }
        ]
      }
    }
  }
  
  // Initialize component
  onMounted(() => {
    setDateRange('week')
  })
  </script>