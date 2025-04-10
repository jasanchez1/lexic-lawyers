import { ref, watch } from 'vue'
import { useReviewsService } from '~/services/reviews-service'
import { useAuth } from '~/composables/useAuth' // This is OK here because useReviews will be called in a setup context

export function useReviews() {
  const reviewsService = useReviewsService()
  const { user } = useAuth() // This is now in the right context
  
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
    if (!user.value?.lawyer_id) {
      throw new Error('You must be logged in as a lawyer to reply to reviews')
    }
    
    try {
      const response = await reviewsService.replyToReview(reviewId, { content }, user.value.lawyer_id)
      
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