import { ApiService } from "./api";
import type { Lawyer, Education, WorkExperience, Achievement, LawyerDocument } from "~/types/lawyer";
import { getAccessToken } from "~/utils/cookies";

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
    try {
      const config = useRuntimeConfig();
      const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000';
      const url = `${BASE_URL}/lawyers/${lawyerId}/documents`;
      
      // Use the common request method from ApiService
      return this.requestFormData<any>(url, 'POST', documentData);
    } catch (error) {
      console.error('Error in uploadLawyerDocument:', error);
      throw error;
    }
  }
  
  // Request method for form data
  protected async requestFormData<T>(
    endpoint: string,
    method: string = "POST",
    formData: FormData,
  ): Promise<T> {
    // Get base URL from runtime config
    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseUrl || "http://localhost:8000";

    const defaultHeaders: Record<string, string> = {};

    // Only add authorization header in client-side
    if (process.client) {
      const token = getAccessToken();
      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: "include", // Include cookies in request (for cross-origin requests)
      body: formData
    };

    try {
      console.log(`API Form Request: ${method} ${endpoint}`);
      const response = await fetch(url, options);

      // Check if the response is 401 Unauthorized
      if (response.status === 401 && process.client) {
        console.log("Received 401 unauthorized during form upload");
        throw new Error("Authentication error during file upload");
      }

      // Check for other error responses
      if (!response.ok) {
        console.error(
          "API Error response:",
          response.status,
          response.statusText
        );
        let errorData: any = {};

        try {
          const errorText = await response.text();
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { detail: errorText };
          }
          console.error("Error data:", errorData);
        } catch (e) {
          console.error("Failed to parse error response");
        }

        // Create a more meaningful error message
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        throw new Error(errorMessage);
      }

      // Parse response as JSON or return empty object if no content
      if (response.status !== 204) {
        const jsonResponse = await response.json();
        return jsonResponse as T;
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error(`API Form Data Error:`, error);
      throw error;
    }
  }
  
  // Get lawyer documents
  async getLawyerDocuments(lawyerId: string) {
    return this.request<LawyerDocument[]>(`/lawyers/${lawyerId}/documents`, "GET");
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