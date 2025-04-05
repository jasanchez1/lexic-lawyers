import { ApiService } from "./api";
import type { Lawyer } from "~/types/lawyer";

export class LawyerService extends ApiService {
  async getLawyerProfile(lawyerId?: string) {
    // Default to user's own lawyer profile if no ID provided
    const endpoint = lawyerId ? `/lawyers/${lawyerId}` : "/auth/me/lawyer";

    try {
      return this.request(endpoint, "GET");
    } catch (error) {
      console.error("Error fetching lawyer profile:", error);
      throw error;
    }
  }

  async updateLawyerProfile(lawyerId: string, data: any) {
    try {
      return this.request(`/lawyers/${lawyerId}`, "PATCH", data);
    } catch (error) {
      console.error("Error updating lawyer profile:", error);
      throw error;
    }
  }

  async getLawyerExperience(lawyerId: string) {
    try {
      return this.request(`/lawyers/${lawyerId}/experience`, "GET");
    } catch (error) {
      console.error("Error fetching lawyer experience:", error);
      throw error;
    }
  }

  async getLawyerReviews(lawyerId: string) {
    try {
      return this.request(`/lawyers/${lawyerId}/reviews`, "GET");
    } catch (error) {
      console.error("Error fetching lawyer reviews:", error);
      throw error;
    }
  }

  async replyToReview(
    lawyerId: string,
    reviewId: string,
    data: { content: string }
  ) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/reviews/${reviewId}`,
        "PATCH",
        data
      );
    } catch (error) {
      console.error("Error replying to review:", error);
      throw error;
    }
  }

  // Education endpoints

  async createLawyerEducation(lawyerId: string, data: any) {
    try {
      return this.request(`/lawyers/${lawyerId}/education`, "POST", data);
    } catch (error) {
      console.error("Error creating lawyer education:", error);
      throw error;
    }
  }

  async updateLawyerEducation(
    lawyerId: string,
    educationId: string,
    data: any
  ) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/education/${educationId}`,
        "PATCH",
        data
      );
    } catch (error) {
      console.error("Error updating lawyer education:", error);
      throw error;
    }
  }

  async deleteLawyerEducation(lawyerId: string, educationId: string) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/education/${educationId}`,
        "DELETE"
      );
    } catch (error) {
      console.error("Error deleting lawyer education:", error);
      throw error;
    }
  }

  // Work experience endpoints

  async createLawyerWorkExperience(lawyerId: string, data: any) {
    try {
      return this.request(`/lawyers/${lawyerId}/work-experience`, "POST", data);
    } catch (error) {
      console.error("Error creating lawyer work experience:", error);
      throw error;
    }
  }

  async updateLawyerWorkExperience(
    lawyerId: string,
    experienceId: string,
    data: any
  ) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/work-experience/${experienceId}`,
        "PATCH",
        data
      );
    } catch (error) {
      console.error("Error updating lawyer work experience:", error);
      throw error;
    }
  }

  async deleteLawyerWorkExperience(lawyerId: string, experienceId: string) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/work-experience/${experienceId}`,
        "DELETE"
      );
    } catch (error) {
      console.error("Error deleting lawyer work experience:", error);
      throw error;
    }
  }

  // Achievements endpoints

  async createLawyerAchievement(lawyerId: string, data: any) {
    try {
      return this.request(`/lawyers/${lawyerId}/achievements`, "POST", data);
    } catch (error) {
      console.error("Error creating lawyer achievement:", error);
      throw error;
    }
  }

  async updateLawyerAchievement(
    lawyerId: string,
    achievementId: string,
    data: any
  ) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/achievements/${achievementId}`,
        "PATCH",
        data
      );
    } catch (error) {
      console.error("Error updating lawyer achievement:", error);
      throw error;
    }
  }

  async deleteLawyerAchievement(lawyerId: string, achievementId: string) {
    try {
      return this.request(
        `/lawyers/${lawyerId}/achievements/${achievementId}`,
        "DELETE"
      );
    } catch (error) {
      console.error("Error deleting lawyer achievement:", error);
      throw error;
    }
  }

  // Analytics endpoint

  async getProfileStats(lawyerId: string, period = "week") {
    try {
      return this.request(
        `/analytics/summary?lawyer_id=${lawyerId}&period=${period}`,
        "GET"
      );
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      throw error;
    }
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
