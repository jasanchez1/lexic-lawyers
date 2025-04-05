<template>
    <div>
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Cargando pregunta...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
        {{ error }}
      </div>
      
      <!-- Question content -->
      <div v-else-if="question" class="space-y-6">
        <!-- Question card -->
        <QuestionsQuestionCard :question="question" />
        
        <!-- New answer form -->
        <QuestionsAnswerForm
          v-if="showAnswerForm"
          :question-id="question.id"
          :initial-content="editingAnswer ? editingAnswer.content : ''"
          :is-submitting="isSubmittingAnswer"
          :is-editing="!!editingAnswer"
          @submit="handleSubmitAnswer"
          @cancel="cancelAnswerForm"
        />
        
        <!-- Answer button if form is not shown -->
        <div v-else class="flex justify-end">
          <button
            @click="showAnswerForm = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Responder a esta pregunta
          </button>
        </div>
        
        <!-- Answers list -->
        <QuestionsAnswerList
          :answers="answers"
          :is-loading="isLoadingAnswers"
          @edit="editAnswer"
          @delete="deleteAnswer"
          @reply="handleReply"
        />
      </div>
      
      <!-- Not found state -->
      <div v-else class="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p class="text-gray-500">Pregunta no encontrada</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useQuestionDetail } from '~/composables/useQuestionDetail';
  import { useAnswers } from '~/composables/useAnswers';
  import { useNotifications } from '~/composables/useNotifications';
  
  const props = defineProps({
    questionId: {
      type: String,
      required: true
    }
  });
  
  // Question data
  const { question, isLoading, error, fetchQuestion } = useQuestionDetail();
  
  // Answers data
  const { 
    answers, 
    isLoading: isLoadingAnswers, 
    fetchAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer: removeAnswer,
    createReply: submitReply
  } = useAnswers();
  
  // Notifications
  const { success, error: showError } = useNotifications();
  
  // UI state
  const showAnswerForm = ref(false);
  const isSubmittingAnswer = ref(false);
  const editingAnswer = ref(null);
  
  // Fetch data
  onMounted(async () => {
    try {
      await fetchQuestion(props.questionId);
      await fetchAnswers(props.questionId);
    } catch (err) {
      showError('Error', 'No se pudo cargar la pregunta o respuestas');
    }
  });
  
  // Handle answer submission
  const handleSubmitAnswer = async (data) => {
    isSubmittingAnswer.value = true;
    
    try {
      if (editingAnswer.value) {
        // Update existing answer
        await updateAnswer(editingAnswer.value.id, data);
        success('Respuesta actualizada con éxito');
      } else {
        // Create new answer
        await createAnswer(props.questionId, data);
        success('Respuesta publicada con éxito');
      }
      
      // Reset state
      showAnswerForm.value = false;
      editingAnswer.value = null;
    } catch (err) {
      showError('Error', 'No se pudo guardar la respuesta');
    } finally {
      isSubmittingAnswer.value = false;
    }
  };
  
  // Edit an answer
  const editAnswer = (answer) => {
    editingAnswer.value = answer;
    showAnswerForm.value = true;
  };
  
  // Delete an answer
  const deleteAnswer = async (answerId) => {
    try {
      await removeAnswer(answerId);
      success('Respuesta eliminada con éxito');
    } catch (err) {
      showError('Error', 'No se pudo eliminar la respuesta');
    }
  };
  
  // Handle reply to an answer
  const handleReply = async (data) => {
    try {
      await submitReply(data.answerId, { content: data.content });
      success('Respuesta enviada con éxito');
    } catch (err) {
      showError('Error', 'No se pudo enviar la respuesta');
    }
  };
  
  // Cancel answer form
  const cancelAnswerForm = () => {
    showAnswerForm.value = false;
    editingAnswer.value = null;
  };
  </script>