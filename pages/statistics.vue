<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Estadísticas</h1>

    <!-- Date Range Selector -->
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div class="flex flex-wrap items-center justify-between">
        <h2 class="text-lg font-medium mb-2 md:mb-0">Rango de Fechas</h2>

        <div class="flex items-center space-x-2">
          <button v-for="period in periods" :key="period.value" @click="setDateRange(period.value)"
            class="px-3 py-1.5 text-sm rounded-md" :class="[
              selectedPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]">
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4">
      </div>
      <p class="text-gray-500">Cargando estadísticas...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
      {{ error }}
    </div>

    <div v-else-if="statsData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsMetricsCard 
          title="Vistas de Perfil" 
          :value="statsData.data.counts.profile_views || 0" 
          icon="Eye" 
          tooltip="Número de personas que han visitado tu perfil completo" 
        />
        <StatsMetricsCard 
          title="Apariciones en Búsqueda" 
          :value="statsData.data.counts.impressions || 0" 
          icon="Users" 
          tooltip="Veces que tu perfil ha aparecido en los resultados de búsqueda de clientes potenciales" 
        />
        <StatsMetricsCard 
          title="Mensajes" 
          :value="statsData.data.counts.messages_sent || 0" 
          icon="MessageSquare" 
        />
        <StatsMetricsCard 
          title="Tasa de Mensajes" 
          :value="statsData.data.rates.message_rate || 0" 
          isPercentage
          icon="TrendingUp" 
          tooltip="Porcentaje de visitantes que te envían un mensaje después de ver tu perfil" 
        />
      </div>

      <!-- Position Data -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Impression Position Data -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center mb-4">
            <h2 class="text-lg font-medium">Apariciones por Posición</h2>
            <button class="ml-1 text-gray-400 hover:text-gray-600" @mouseover="showImpressionsTooltip = true" @mouseleave="showImpressionsTooltip = false">
              <HelpCircle class="w-4 h-4" />
              <div v-if="showImpressionsTooltip" class="absolute z-10 w-64 p-2 mt-2 text-sm text-left text-white bg-gray-800 rounded-md shadow-lg">
                Muestra cuántas veces tu perfil ha aparecido en diferentes posiciones de los resultados de búsqueda
              </div>
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(value, position) in statsData.data.position_data.impression_stats" :key="position"
              class="flex items-center">
              <div class="w-32 text-sm font-medium">{{ formatPositionName(position) }}</div>
              <div class="flex-1 mx-4">
                <div class="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full"
                    :style="{ width: `${calculatePercentage(value, getTotalImpressions())}%` }"></div>
                </div>
              </div>
              <div class="w-16 text-right text-sm font-medium">{{ value }}</div>
            </div>
          </div>
        </div>

        <!-- Click through rate by position -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center mb-4">
            <h2 class="text-lg font-medium">Tasa de Clics por Posición</h2>
            <button class="ml-1 text-gray-400 hover:text-gray-600" @mouseover="showCTRTooltip = true" @mouseleave="showCTRTooltip = false">
              <HelpCircle class="w-4 h-4" />
              <div v-if="showCTRTooltip" class="absolute z-10 w-64 p-2 mt-2 text-sm text-left text-white bg-gray-800 rounded-md shadow-lg">
                Porcentaje de veces que los usuarios hacen clic en tu perfil al verlo en los resultados de búsqueda, según tu posición
              </div>
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(rate, position) in statsData.data.position_data.ctr_by_position" :key="position"
              class="flex items-center">
              <div class="w-32 text-sm font-medium">{{ formatPositionName(position) }}</div>
              <div class="flex-1 mx-4">
                <div class="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full" :style="{ width: `${Math.min(rate * 100, 100)}%` }">
                  </div>
                </div>
              </div>
              <div class="w-16 text-right text-sm font-medium">{{ (rate * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Rate Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Message Rate -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Tasa de Contacto</h2>
          <div class="mb-4">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium">Tasa de Mensajes</span>
              <span class="text-sm font-medium">{{ statsData.data.rates.message_rate.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full"
                :style="{ width: `${Math.min(statsData.data.rates.message_rate, 100)}%` }"></div>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Porcentaje de usuarios que te envían un mensaje después de ver tu perfil.
            </p>
          </div>

          <div class="mb-4">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium">Tasa de Llamadas</span>
              <span class="text-sm font-medium">{{ statsData.data.rates.call_rate.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-500 h-2.5 rounded-full"
                :style="{ width: `${Math.min(statsData.data.rates.call_rate, 100)}%` }"></div>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Porcentaje de usuarios que te llaman después de ver tu perfil.
            </p>
          </div>
        </div>

        <!-- Profile Performance Tips -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-medium mb-4">Consejos de Rendimiento</h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 text-sm font-bold">1</span>
              </div>
              <p class="text-sm">
                Completa tu perfil con información detallada sobre tus áreas de especialización.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 text-sm font-bold">2</span>
              </div>
              <p class="text-sm">
                Responde a los mensajes rápidamente para mejorar tu tasa de respuesta.
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 text-sm font-bold">3</span>
              </div>
              <p class="text-sm">
                Solicita reseñas a tus clientes satisfechos para mejorar tu visibilidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <p class="text-gray-500">No hay datos de estadísticas disponibles.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStatsService } from '~/services/stats-service'
import { useNotifications } from '~/composables/useNotifications'
import { HelpCircle } from 'lucide-vue-next'

definePageMeta({
  middleware: ['lawyer-auth']
})

// Tooltips state
const showImpressionsTooltip = ref(false)
const showCTRTooltip = ref(false)

// Service instances
const statsService = useStatsService()
const { error: showError } = useNotifications()

// Selected period and periods list
const selectedPeriod = ref('week')
const periods = [
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
  { label: 'Trimestre', value: 'quarter' },
  { label: 'Año', value: 'year' }
]

// Statistics data
const isLoading = ref(true)
const error = ref(null)
const statsData = ref(null)

// Set date range based on predefined period
const setDateRange = async (period: string) => {
  selectedPeriod.value = period
  await fetchStats()
}

// Fetch statistics
const fetchStats = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Get stats from the API based on period
    const response = await statsService.getProfileStats(selectedPeriod.value)

    if (!response || !response.success) {
      throw new Error('No se pudo obtener estadísticas')
    }

    // Store the raw API response
    statsData.value = response
  } catch (err) {
    console.error('Error fetching stats:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas'
    showError('Error', 'No se pudieron cargar las estadísticas')
  } finally {
    isLoading.value = false
  }
}

// Helper function to calculate percentage
const calculatePercentage = (value: number, total: number): number => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

// Get total impressions from position data
const getTotalImpressions = (): number => {
  if (!statsData.value?.data?.position_data?.impression_stats) return 0

  return Object.values(statsData.value.data.position_data.impression_stats)
    .reduce((sum: number, val: number) => sum + val, 0)
}

// Format position name for display
const formatPositionName = (position: string): string => {
  if (position === 'top_3') return 'Top 3'
  if (position === 'unknown') return 'Otra posición'
  return position.replace('_', ' ')
}

// Initialize component
onMounted(async () => {
  await fetchStats()
})
</script>