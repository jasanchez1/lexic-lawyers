<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Reseñas de Clientes</h1>
      
      <div class="flex items-center space-x-4">
        <select 
          v-model="filters.rating"
          class="form-input text-sm py-2"
        >
          <option value="">Todas las calificaciones</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </div>
    </div>
    
    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <ReviewsReviewStats :stats="reviewStats" />
      </div>
      
      <div class="md:col-span-2 bg-white rounded-lg shadow-sm border p-6">
        <h2 class="font-medium text-lg mb-4">Información sobre reseñas</h2>
        <ul class="space-y-2 text-gray-600">
          <li class="flex items-start gap-2">
            <CheckCircle class="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Las reseñas son públicas y se muestran en tu perfil de abogado.</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Las reseñas ayudan a potenciales clientes a conocer tus servicios y experiencia.</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Una buena calificación mejora tu posicionamiento en los resultados de búsqueda.</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle class="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Anima a tus clientes satisfechos a dejarte una reseña positiva.</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Reviews List -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">Cargando reseñas...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
      {{ error }}
    </div>
    
    <div v-else-if="reviews.length === 0" class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <p class="text-gray-500 mb-4">No hay reseñas para mostrar con los filtros actuales.</p>
      <button 
        @click="resetFilters"
        class="text-primary-600 hover:text-primary-700 font-medium"
      >
        Quitar filtros
      </button>
    </div>
    
    <div v-else class="space-y-6">
      <ReviewsReviewCard 
        v-for="review in reviews" 
        :key="review.id"
        :review="review"
      />
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded border"
            :class="[
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            Anterior
          </button>
          
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-2 rounded"
            :class="[
              page === currentPage 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded border"
            :class="[
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckCircle } from 'lucide-vue-next'
import { useReviews } from '~/composables/useReviews'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  middleware: ['lawyer-auth']
})

// State
const filters = ref({
  rating: '',
})

// Get reviews data
const { 
  reviews, 
  stats: reviewStats, 
  isLoading, 
  error,
  fetchReviews
} = useReviews()

const { error: showError } = useNotifications()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

// Compute total pages
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value) || 1
})

// Change page
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  
  currentPage.value = page
  fetchFilteredReviews()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    rating: ''
  }
  currentPage.value = 1
  fetchFilteredReviews()
}

// Fetch reviews based on filters
const fetchFilteredReviews = async () => {
  await fetchReviews({
    rating: filters.value.rating,
    page: currentPage.value,
    size: itemsPerPage.value
  })
}

// Watch filters changes to reload reviews
watch(filters, () => {
  currentPage.value = 1 // Reset to first page
  fetchFilteredReviews()
}, { deep: true })

// Load data on mount
onMounted(async () => {
  await fetchFilteredReviews()
})
</script>