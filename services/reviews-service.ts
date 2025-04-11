import { ApiService } from './api'
import type { LawyerReview, ReviewStats } from '~/types/review'

export class ReviewsService extends ApiService {
  async getReviews(lawyerId: string, filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });
    
    return this.request<{ reviews: LawyerReview[], stats: ReviewStats }>(`/lawyers/${lawyerId}/reviews?${queryParams.toString()}`, 'GET');
  }
  
  async replyToReview(reviewId: string, data: { content: string }, lawyerId?: string) {
    // Accept lawyerId as a parameter instead of using useAuth()
    if (!lawyerId) {
      throw new Error('Lawyer ID is required to reply to a review');
    }
    
    return this.request<any>(`/lawyers/${lawyerId}/reviews/${reviewId}`, 'PATCH', data);
  }
}

// Create a singleton instance
let reviewsService: ReviewsService;

export function useReviewsService() {
  if (!reviewsService) {
    reviewsService = new ReviewsService();
  }
  
  return reviewsService;
}