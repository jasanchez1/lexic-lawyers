import { ApiService } from "./api";
import type { Lawyer, Education, WorkExperience, Achievement, LawyerDocument } from "~/types/lawyer";

export class LawyerService extends ApiService {
  async getLawyerProfile(lawyerId: string) {
    return this.request<Lawyer>(`/lawyers/${lawyerId}`, "GET");
  }

  async updateLawyerProfile(lawyerId: string, data: any) {
    return this.request<Lawyer>(`/lawyers/${lawyerId}`, "PATCH", data);
  }

  async getLawyerExperience(lawyerId: string) {
    return this.request<any>(`/lawyers/${lawyerId}/experience`, "GET");
  }

  // Create a new lawyer profile
  async createLawyer(data: any) {
    return this.request<Lawyer>('/lawyers', 'POST', data);
  }

  // Upload lawyer documents
  async uploadLawyerDocument(lawyerId: string, documentData: FormData) {
    const token = await this.getAccessToken();
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000';
    
    const response = await fetch(`${BASE_URL}/api/lawyers/${lawyerId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: documentData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Get lawyer documents
  async getLawyerDocuments(lawyerId: string) {
    return this.request<LawyerDocument[]>(`/lawyers/${lawyerId}/documents`, "GET");
  }

  // Get access token helper
  private async getAccessToken(): Promise<string> {
    if (process.client) {
      const { getAccessToken, refreshToken } = useAuth();
      let token = getAccessToken();
      
      // If token is not available, try to refresh
      if (!token) {
        await refreshToken();
        token = getAccessToken();
      }
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      return token;
    }
    
    return '';
  }

  // Education endpoints
  async createLawyerEducation(lawyerId: string, data: Education) {
    return this.request<Education>(`/lawyers/${lawyerId}/education`, "POST", data);
  }

  async updateLawyerEducation(lawyerId: string, educationId: string, data: Partial<Education>) {
    return this.request<Education>(`/lawyers/${lawyerId}/education/${educationId}`, "PATCH", data);
  }

  async deleteLawyerEducation(lawyerId: string, educationId: string) {
    return this.request(`/lawyers/${lawyerId}/education/${educationId}`, "DELETE");
  }

  // Work experience endpoints
  async createLawyerWorkExperience(lawyerId: string, data: WorkExperience) {
    return this.request<WorkExperience>(`/lawyers/${lawyerId}/work-experience`, "POST", data);
  }

  async updateLawyerWorkExperience(lawyerId: string, experienceId: string, data: Partial<WorkExperience>) {
    return this.request<WorkExperience>(`/lawyers/${lawyerId}/work-experience/${experienceId}`, "PATCH", data);
  }

  async deleteLawyerWorkExperience(lawyerId: string, experienceId: string) {
    return this.request(`/lawyers/${lawyerId}/work-experience/${experienceId}`, "DELETE");
  }

  // Achievements endpoints
  async createLawyerAchievement(lawyerId: string, data: Achievement) {
    return this.request<Achievement>(`/lawyers/${lawyerId}/achievements`, "POST", data);
  }

  async updateLawyerAchievement(lawyerId: string, achievementId: string, data: Partial<Achievement>) {
    return this.request<Achievement>(`/lawyers/${lawyerId}/achievements/${achievementId}`, "PATCH", data);
  }

  async deleteLawyerAchievement(lawyerId: string, achievementId: string) {
    return this.request(`/lawyers/${lawyerId}/achievements/${achievementId}`, "DELETE");
  }
}

// Create a singleton instance
let lawyerService: LawyerService;

export function useLawyerService() {
  if (!lawyerService) {
    lawyerService = new LawyerService();
  }

  return lawyerService;
}