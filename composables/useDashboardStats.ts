import { ref, onMounted } from "vue";
import { useStatsService } from "~/services/stats-service";

export function useDashboardStats() {
  const statsService = useStatsService();

  const stats = ref({
    profileViews: 0,
    profileImpressions: 0,
    messagesSent: 0,
    messageRate: 0,
    overallCTR: 0
  });

  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const fetchDashboardStats = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Call the API
      const response = await statsService.getDashboardStats();
      
      if (!response || !response.success) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const data = response.data;
      
      // Map the API response to our stats structure using only what's available
      stats.value = {
        profileViews: data.counts?.profile_views || 0,
        profileImpressions: data.counts?.impressions || 0,
        messagesSent: data.counts?.messages_sent || 0,
        messageRate: data.rates?.message_rate || 0,
        overallCTR: data.rates?.overall_ctr || 0
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