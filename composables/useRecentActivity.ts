import { ref, onMounted } from 'vue'
import { useStatsService } from '~/services/stats-service'

interface Activity {
  type: 'message' | 'view' | 'impression' | 'click';
  description: string;
  timestamp: string;
  actionUrl?: string;
}

export function useRecentActivity() {
  const statsService = useStatsService()
  
  const activities = ref<Activity[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  
  const fetchRecentActivity = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch data from the API
      const response = await statsService.getRecentActivity();
      
      if (!response || !response.success) {
        throw new Error('Failed to fetch recent activity');
      }
      
      const data = response.data;
      
      // Create activities based on the API data
      const generatedActivities: Activity[] = [];

      // Profile views activity
      if (data.counts.profile_views > 0) {
        generatedActivities.push({
          type: 'view',
          description: `Tu perfil ha sido visto ${data.counts.profile_views} veces`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/statistics'
        });
      }

      // Messages activity
      if (data.counts.messages_sent > 0) {
        generatedActivities.push({
          type: 'message',
          description: `Has recibido ${data.counts.messages_sent} mensajes`,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/messages'
        });
      }

      // Impressions activity
      if (data.counts.impressions > 0) {
        generatedActivities.push({
          type: 'impression',
          description: `Tu perfil apareció en ${data.counts.impressions} resultados de búsqueda`,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/statistics'
        });
      }

      // Clicks activity (if available)
      if (data.counts.clicks > 0) {
        generatedActivities.push({
          type: 'click',
          description: `Tu perfil recibió ${data.counts.clicks} clics en búsquedas`,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/statistics'
        });
      }

      // Set the activities
      activities.value = generatedActivities;
    } catch (err) {
      console.error('Error fetching recent activity:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar actividad reciente'
    } finally {
      isLoading.value = false
    }
  }
  
  onMounted(() => {
    fetchRecentActivity()
  })
  
  return {
    activities,
    isLoading,
    error,
    fetchRecentActivity
  }
}