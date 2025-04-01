import { ref, onMounted } from "vue";
import { useStatsService } from "~/services/stats-service";

export function useDashboardStats() {
  const statsService = useStatsService();

  const stats = ref({
    profileViews: 0,
    newQuestions: 0,
    totalAnswers: 0,
    rating: 0,
    responseRate: 0,
    avgResponseTime: 0,
    profileImpressions: 0,
    contactRequests: 0,
  });

  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const fetchDashboardStats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // For a real implementation, call the API here
      const response = await statsService.getDashboardStats();

      stats.value = {
        ...stats.value,
        ...response,
      };
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar estadísticas";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchDashboardStats();
  });

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
  };
}
