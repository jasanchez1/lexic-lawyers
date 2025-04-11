import { ref, watch } from 'vue'
import { useReviewsService } from '~/services/reviews-service'
import { useAuth } from '~/composables/useAuth'

export function useReviews() {
  const reviewsService = useReviewsService()
  const { user } = useAuth()
  
  const reviews = ref([])
  const stats = ref({
    average: 0,
    total: 0,
    distribution: {}
  })
  const isLoading = ref(false)
  const error = ref(null)
  
  const fetchReviews = async (filters = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Make sure we have a lawyer ID
      if (!user.value?.lawyer_id) {
        throw new Error('No lawyer ID available to fetch reviews');
      }
      
      // Store lawyer ID in localStorage for service use
      if (process.client) {
        localStorage.setItem('authData', JSON.stringify({ 
          lawyerId: user.value.lawyer_id 
        }));
      }
      
      const response = await reviewsService.getReviews(filters)
      
      reviews.value = response.reviews || []
      stats.value = response.stats || {
        average: 0,
        total: 0,
        distribution: {}
      }
      
      return { reviews: reviews.value, stats: stats.value }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar reseñas'
      return { reviews: [], stats: stats.value }
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews
  }
}