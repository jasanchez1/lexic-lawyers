import { ApiService } from './api';
import type { PracticeArea } from '~/types/lawyer';

export class PracticeAreasService extends ApiService {
  async getPracticeAreas(categoryId?: string, categorySlug?: string) {
    const queryParams = new URLSearchParams();
    
    if (categoryId) {
      queryParams.append('category_id', categoryId);
    }
    
    if (categorySlug) {
      queryParams.append('category_slug', categorySlug);
    }
    
    return this.request<PracticeArea[]>(`/areas?${queryParams.toString()}`, 'GET');
  }
  
  async getPracticeAreasByCategory() {
    return this.request<any[]>('/areas/by-category', 'GET');
  }
  
  async getPracticeAreaWithCounts() {
    return this.request<any[]>('/areas/with-counts', 'GET');
  }
}

// Create a singleton instance
let practiceAreasService: PracticeAreasService;

export function usePracticeAreasService() {
  if (!practiceAreasService) {
    practiceAreasService = new PracticeAreasService();
  }
  
  return practiceAreasService;
}