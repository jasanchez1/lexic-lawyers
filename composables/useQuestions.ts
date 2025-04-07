// composables/useQuestions.ts
import { ref, computed } from 'vue'
import { useQuestionsService } from '~/services/questions-service'
import type { Question, QuestionsList } from '~/types/question'

export function useQuestions() {
  const questionsService = useQuestionsService()
  
  const questions = ref<Question[]>([])
  const totalQuestions = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const itemsPerPage = ref(10)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Calculate total pages
  const computedTotalPages = computed(() => {
    return Math.ceil(totalQuestions.value / itemsPerPage.value)
  })
  
  // Fetch questions with filters
  const fetchQuestions = async (
    status = 'unanswered',
    area = '',
    page = 1,
    size = 10,
    sort = 'latest'
  ) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.getQuestions({
        status,
        area,
        page,
        size,
        sort
      })
      
      questions.value = response.questions || []
      totalQuestions.value = response.total || 0
      currentPage.value = page
      itemsPerPage.value = size
      totalPages.value = response.pages || Math.ceil(totalQuestions.value / itemsPerPage.value)
      
      return questions.value
    } catch (err) {
      console.error('Error fetching questions:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar preguntas'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Get a single question by ID
  const getQuestion = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.getQuestion(id)
      return response
    } catch (err) {
      console.error('Error fetching question:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar la pregunta'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // Create a new question
  const createQuestion = async (data: any) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.createQuestion(data)
      return response
    } catch (err) {
      console.error('Error creating question:', err)
      error.value = err instanceof Error ? err.message : 'Error al crear la pregunta'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Update a question
  const updateQuestion = async (id: string, data: any) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await questionsService.updateQuestion(id, data)
      return response
    } catch (err) {
      console.error('Error updating question:', err)
      error.value = err instanceof Error ? err.message : 'Error al actualizar la pregunta'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete a question
  const deleteQuestion = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await questionsService.deleteQuestion(id)
      return true
    } catch (err) {
      console.error('Error deleting question:', err)
      error.value = err instanceof Error ? err.message : 'Error al eliminar la pregunta'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    questions,
    totalQuestions,
    totalPages: computedTotalPages,
    currentPage,
    itemsPerPage,
    isLoading,
    error,
    fetchQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
  }
}