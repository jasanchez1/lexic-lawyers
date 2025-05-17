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
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6">
          <!-- Question header -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-2">
                {{ question.title }}
              </h2>
              <div class="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                <span>{{ formatDate(question.date) }}</span>
                <span v-if="question.location">{{ question.location }}</span>
                <span>Vistas: {{ question.viewCount }}</span>
                <span>Respuestas: {{ question.answerCount }}</span>
              </div>
            </div>
            
            <div class="flex items-center">
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="statusClass"
              >
                {{ statusText }}
              </span>
            </div>
          </div>
          
          <!-- Question content -->
          <div class="prose prose-sm max-w-none mb-6">
            <p>{{ question.content }}</p>
          </div>
          
          <!-- Question tags/topics -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="topic in question.topics" 
              :key="topic.id"
              class="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {{ topic.name }}
            </span>
          </div>
        </div>
      </div>
      
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuestionDetail } from '~/composables/useQuestionDetail';
import { useAnswers } from '~/composables/useAnswers';
import { useNotifications } from '~/composables/useNotifications';

const route = useRoute();
const questionId = computed(() => route.params.id as string);

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

// Define the loadQuestionData function before it's used
const loadQuestionData = async (id: string) => {
  try {
    await fetchQuestion(id);
    await fetchAnswers(id);
  } catch (err) {
    showError('Error', 'No se pudo cargar la pregunta o respuestas');
  }
};

// Fetch data whenever the questionId changes
watch(() => questionId.value, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadQuestionData(newId);
  }
}, { immediate: true });

// Compute question status
const statusText = computed(() => {
  if (!question.value) return '';
  if (question.value.status === 'accepted') return 'Respuesta aceptada';
  if (question.value.answerCount > 0) return 'Respondida';
  return 'Sin responder';
});

// Compute status class
const statusClass = computed(() => {
  if (!question.value) return '';
  if (question.value.status === 'accepted') return 'bg-green-100 text-green-800';
  if (question.value.answerCount > 0) return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
});

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  // Format: 12 de mayo de 2023
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

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
      await createAnswer(questionId.value, data);
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

// Ensure data is loaded on component mount
onMounted(async () => {
  if (questionId.value) {
    await loadQuestionData(questionId.value);
  }
});
</script>