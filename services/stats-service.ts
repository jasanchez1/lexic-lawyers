import { ApiService } from './api';

export class StatsService extends ApiService {
  async getDashboardStats() {
    // Get summary analytics data
    return this.request<any>('/analytics/summary', 'GET');
  }
  
  async getRecentActivity() {
    // This would be a separate endpoint in a real API
    // For now, we're reusing the summary endpoint
    return this.request<any>('/analytics/summary', 'GET');
  }
  
  async getProfileStats(period = 'week') {
    // Get analytics summary data
    try {
      const response = await this.request<any>('/analytics/summary', 'GET');
      
      if (!response || !response.success) {
        throw new Error('Failed to get analytics data');
      }
      
      // Return the raw data as received from the API
      return response;
    } catch (error) {
      console.error('Error getting profile stats:', error);
      throw error;
    }
  }
  
  // Track profile views
  async trackProfileView(lawyerId: string, source?: string) {
    const data = {
      lawyer_id: lawyerId,
      source: source || 'direct',
      timestamp: new Date().toISOString()
    };
    
    return this.request<any>('/analytics/profile-view', 'POST', data);
  }
  
  // Track listing clicks
  async trackListingClick(lawyerId: string, data: any) {
    return this.request<any>('/analytics/listing-click', 'POST', {
      lawyer_id: lawyerId,
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

// Create a singleton instance
let statsService: StatsService;

export function useStatsService() {
  if (!statsService) {
    statsService = new StatsService();
  }
  
  return statsService;
}