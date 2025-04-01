import { ref, onMounted } from 'vue'
import { useStatsService } from '~/services/stats-service'

interface Activity {
  type: 'message' | 'view' | 'review' | 'question' | 'answer' | 'contact' | 'system';
  description: string;
  timestamp: string;
  actionUrl?: string;
}

interface Question {
  id: string;
  title: string;
  date: string;
  location?: string;
}

export function useRecentActivity() {
  const statsService = useStatsService()
  
  const activities = ref<Activity[]>([])
  const questions = ref<Question[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  
  const fetchRecentActivity = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real implementation, call the API here
      const response = await statsService.getRecentActivity()
      
      activities.value = response.activities || []
      questions.value = response.questions || []
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
    questions,
    isLoading,
    error,
    fetchRecentActivity
  }
}