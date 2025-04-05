import { ref } from 'vue';
import { useLawyerService } from '~/services/lawyer-service';

export function useProfile() {
  const lawyerService = useLawyerService();
  
  const profile = ref(null);
  const education = ref([]);
  const workExperience = ref([]);
  const achievements = ref([]);
  const isLoading = ref(false);
  const isUpdating = ref(false);
  const error = ref(null);
  
  // Fetch lawyer profile
  const fetchProfile = async (lawyerId: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.getLawyerProfile(lawyerId);
      profile.value = response;
      return response;
    } catch (err) {
      console.error('Error fetching lawyer profile:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar perfil';
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Update lawyer profile
  const updateProfile = async (lawyerId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.updateLawyerProfile(lawyerId, data);
      profile.value = {
        ...profile.value,
        ...response
      };
      return response;
    } catch (err) {
      console.error('Error updating lawyer profile:', err);
      error.value = err instanceof Error ? err.message : 'Error al actualizar perfil';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Fetch lawyer experience and education
  const fetchExperience = async (lawyerId: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.getLawyerExperience(lawyerId);
      education.value = response.education || [];
      workExperience.value = response.work_experience || [];
      achievements.value = response.achievements || [];
      return response;
    } catch (err) {
      console.error('Error fetching lawyer experience:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar experiencia';
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Add education entry
  const addEducation = async (lawyerId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.createLawyerEducation(lawyerId, data);
      education.value = [...education.value, response];
      return response;
    } catch (err) {
      console.error('Error adding education:', err);
      error.value = err instanceof Error ? err.message : 'Error al agregar educación';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Update education entry
  const updateEducation = async (lawyerId: string, educationId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.updateLawyerEducation(lawyerId, educationId, data);
      
      // Update in local state
      const index = education.value.findIndex(item => item.id === educationId);
      if (index !== -1) {
        education.value[index] = response;
      }
      
      return response;
    } catch (err) {
      console.error('Error updating education:', err);
      error.value = err instanceof Error ? err.message : 'Error al actualizar educación';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Delete education entry
  const deleteEducation = async (lawyerId: string, educationId: string) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      await lawyerService.deleteLawyerEducation(lawyerId, educationId);
      
      // Remove from local state
      education.value = education.value.filter(item => item.id !== educationId);
      
      return true;
    } catch (err) {
      console.error('Error deleting education:', err);
      error.value = err instanceof Error ? err.message : 'Error al eliminar educación';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Add work experience entry
  const addWorkExperience = async (lawyerId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.createLawyerWorkExperience(lawyerId, data);
      workExperience.value = [...workExperience.value, response];
      return response;
    } catch (err) {
      console.error('Error adding work experience:', err);
      error.value = err instanceof Error ? err.message : 'Error al agregar experiencia laboral';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Update work experience entry
  const updateWorkExperience = async (lawyerId: string, experienceId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.updateLawyerWorkExperience(lawyerId, experienceId, data);
      
      // Update in local state
      const index = workExperience.value.findIndex(item => item.id === experienceId);
      if (index !== -1) {
        workExperience.value[index] = response;
      }
      
      return response;
    } catch (err) {
      console.error('Error updating work experience:', err);
      error.value = err instanceof Error ? err.message : 'Error al actualizar experiencia laboral';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Delete work experience entry
  const deleteWorkExperience = async (lawyerId: string, experienceId: string) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      await lawyerService.deleteLawyerWorkExperience(lawyerId, experienceId);
      
      // Remove from local state
      workExperience.value = workExperience.value.filter(item => item.id !== experienceId);
      
      return true;
    } catch (err) {
      console.error('Error deleting work experience:', err);
      error.value = err instanceof Error ? err.message : 'Error al eliminar experiencia laboral';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Add achievement entry
  const addAchievement = async (lawyerId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.createLawyerAchievement(lawyerId, data);
      achievements.value = [...achievements.value, response];
      return response;
    } catch (err) {
      console.error('Error adding achievement:', err);
      error.value = err instanceof Error ? err.message : 'Error al agregar logro';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Update achievement entry
  const updateAchievement = async (lawyerId: string, achievementId: string, data: any) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      const response = await lawyerService.updateLawyerAchievement(lawyerId, achievementId, data);
      
      // Update in local state
      const index = achievements.value.findIndex(item => item.id === achievementId);
      if (index !== -1) {
        achievements.value[index] = response;
      }
      
      return response;
    } catch (err) {
      console.error('Error updating achievement:', err);
      error.value = err instanceof Error ? err.message : 'Error al actualizar logro';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };
  
  // Delete achievement entry
  const deleteAchievement = async (lawyerId: string, achievementId: string) => {
    isUpdating.value = true;
    error.value = null;
    
    try {
      await lawyerService.deleteLawyerAchievement(lawyerId, achievementId);
      
      // Remove from local state
      achievements.value = achievements.value.filter(item => item.id !== achievementId);
      
      return true;
    } catch (err) {
      console.error('Error deleting achievement:', err);
      error.value = err instanceof Error ? err.message : 'Error al eliminar logro';
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };

  return {
    profile,
    education,
    workExperience,
    achievements,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateProfile,
    fetchExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addAchievement,
    updateAchievement,
    deleteAchievement
  };
}