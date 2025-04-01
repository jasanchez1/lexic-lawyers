import { ApiService } from './api'

export class ReviewsService extends ApiService {
  async getReviews(filters = {}) {
    const queryParams = new URLSearchParams()
    
    // Add filters to query parameters
    if (filters.rating) {
      queryParams.append('rating', filters.rating.toString())
    }
    
    if (filters.status) {
      queryParams.append('status', filters.status)
    }
    
    if (filters.page) {
      queryParams.append('page', filters.page.toString())
    }
    
    if (filters.size) {
      queryParams.append('size', filters.size.toString())
    }
    
    // For development, return mock data
    // In production, use:
    // return this.request(`/lawyer/${lawyerId}/reviews?${queryParams.toString()}`, 'GET')
    
    // Mock data
    return {
      reviews: [
        {
          id: 'r1',
          rating: 5,
          title: 'Excelente servicio',
          content: 'El abogado fue muy profesional y me ayudó a resolver mi caso rápidamente. Muy recomendable.',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          author: 'Juan Pérez',
          isVerifiedClient: true,
          hasReply: true,
          reply: {
            id: 'reply1',
            content: 'Muchas gracias por su reseña, Juan. Fue un placer ayudarle con su caso. Estamos a su disposición para cualquier consulta futura.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            author: 'Tú'
          }
        },
        {
          id: 'r2',
          rating: 4,
          title: 'Buen servicio, pero caro',
          content: 'El abogado resolvió mi caso con éxito, pero creo que los honorarios son un poco elevados para el servicio prestado.',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          author: 'María González',
          isVerifiedClient: true,
          hasReply: false
        },
        {
          id: 'r3',
          rating: 5,
          title: 'Muy profesional',
          content: 'Excelente atención y asesoramiento. Me explicó todo el proceso de manera clara y sencilla. Totalmente recomendable.',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          author: 'Carlos Rodríguez',
          isVerifiedClient: true,
          hasReply: false
        }
      ],
      stats: {
        average: 4.7,
        total: 3,
        distribution: {
          5: 2,
          4: 1,
          3: 0,
          2: 0,
          1: 0
        }
      }
    }
  }
  
  async replyToReview(reviewId: string, data: any) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/reviews/${reviewId}/reply`, 'POST', data)
    
    // Mock response
    return {
      id: 'reply-' + Date.now(),
      content: data.content,
      date: new Date().toISOString(),
      author: 'Tú'
    }
  }
}

// Create a singleton instance
let reviewsService: ReviewsService

export function useReviewsService() {
  if (!reviewsService) {
    reviewsService = new ReviewsService()
  }
  
  return reviewsService
}