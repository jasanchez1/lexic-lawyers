import { ApiService } from './api'
import type { LawyerReview, ReviewStats } from '~/types/review'
import { useAuth } from '~/composables/useAuth'

export class ReviewsService extends ApiService {
  async getReviews(filters = {}) {
    // This is a workaround since we can't use useAuth() directly in the service class
    // In a real implementation, the lawyerId would either be passed as a parameter
    // or retrieved from a more appropriate source
    let lawyerId = null;
    
    // Try to get lawyerId from localStorage in client mode
    if (process.client) {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          lawyerId = parsedData.lawyerId;
        } catch (e) {
          console.error('Error parsing auth data', e);
        }
      }
    }
    
    // If we couldn't get it from localStorage, try a fallback
    if (!lawyerId) {
      const auth = useAuth();
      lawyerId = auth.user.value?.lawyer_id;
    }
    
    // If still no lawyerId, this will fail
    if (!lawyerId) {
      throw new Error('No lawyer ID available to fetch reviews');
    }
    
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });
    
    return this.request<{ reviews: LawyerReview[], stats: ReviewStats }>(
      `/lawyers/${lawyerId}/reviews?${queryParams.toString()}`, 
      'GET'
    );
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