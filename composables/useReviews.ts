import { ref } from 'vue'
import { useReviewsService } from '~/services/reviews-service'

export function useReviews() {
  const reviewsService = useReviewsService()
  
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
  
  const replyToReview = async (reviewId: string, content: string) => {
    try {
      const response = await reviewsService.replyToReview(reviewId, { content })
      
      // Update the review in the list
      const index = reviews.value.findIndex(r => r.id === reviewId)
      if (index !== -1) {
        reviews.value[index] = {
          ...reviews.value[index],
          hasReply: true,
          reply: response
        }
      }
      
      return response
    } catch (err) {
      console.error('Error replying to review:', err)
      throw err
    }
  }
  
  return {
    reviews,
    stats,
    isLoading,
    error,
    fetchReviews,
    replyToReview
  }
}