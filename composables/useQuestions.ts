import { ref, computed } from 'vue'
import { useQuestionsService } from '~/services/questions-service'

export function useQuestions() {
  const questionsService = useQuestionsService()
  
  const questions = ref([])
  const totalQuestions = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Calculate total pages
  const totalPages = computed(() => {
    return Math.ceil(totalQuestions.value / itemsPerPage.value)
  })
  
  // Fetch questions with filters
  const fetchQuestions = async (
    status = 'unanswered',
    areaId = '',
    page = 1,
    size = 10
  ) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.getQuestions({
        status,
        area: areaId,
        page,
        size
      })
      
      questions.value = response.questions || []
      totalQuestions.value = response.total || 0
      currentPage.value = page
      itemsPerPage.value = size
      
      return questions.value
    } catch (err) {
      console.error('Error fetching questions:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar preguntas'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    questions,
    totalQuestions,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchQuestions
  }
}