import { ref, onMounted } from 'vue';
import { usePracticeAreasService } from '~/services/practice-area-service';

export function usePracticeAreas() {
  const practiceAreasService = usePracticeAreasService();
  const practiceAreas = ref([]);
  const isLoading = ref(true);
  const error = ref(null);
  
  const fetchPracticeAreas = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Call the API to get real practice areas
      const response = await practiceAreasService.getPracticeAreas();
      practiceAreas.value = response || [];
      return practiceAreas.value.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error('Error fetching practice areas:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar áreas de práctica';
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(async () => {
    await fetchPracticeAreas();
  });
  
  return {
    practiceAreas,
    isLoading,
    error,
    fetchPracticeAreas
  };
}