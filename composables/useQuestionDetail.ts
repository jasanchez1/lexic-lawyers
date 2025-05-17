import { ref } from 'vue'
import { useQuestionsService } from '~/services/questions-service'

export function useQuestionDetail() {
  const questionsService = useQuestionsService()
  
  const question = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  const fetchQuestion = async (id: string) => {
    if (!id) {
      console.error('No question ID provided for fetching');
      error.value = 'ID de pregunta no válido';
      return null;
    }

    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.getQuestion(id)
      question.value = response
      return question.value
    } catch (err) {
      console.error('Error fetching question:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar la pregunta'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    question,
    isLoading,
    error,
    fetchQuestion
  }
}