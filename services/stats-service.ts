import { ApiService } from './api'
import type { DashboardStats } from '~/types/stat'

export class StatsService extends ApiService {
  async getDashboardStats() {
    return this.request<DashboardStats>('/analytics/summary', 'GET');
  }
  
  async getRecentActivity() {
    // Since we can't use useAuth() outside of a setup function,
    // we'll have the component pass the lawyerId when needed
    return this.request<any>('/analytics/summary', 'GET');
  }
  
  async getProfileStats(period = 'week', lawyerId?: string) {
    // Allow the lawyerId to be passed as a parameter
    const queryParams = new URLSearchParams();
    queryParams.append('period', period);
    
    if (lawyerId) {
      queryParams.append('lawyer_id', lawyerId);
    }
    
    return this.request<any>(`/analytics/summary?${queryParams.toString()}`, 'GET');
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