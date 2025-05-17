import { ref } from "vue";
import { useAnswersService } from "~/services/answers-service";

export function useAnswers() {
  // State variables
  const answers = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Fetch answers for a question
  const fetchAnswers = async (questionId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Create the service instance inside the function to ensure it's created in the correct context
      const answersService = useAnswersService();
      const response = await answersService.getAnswers(questionId);
      answers.value = response || [];
      return answers.value;
    } catch (err) {
      console.error("Error fetching answers:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar respuestas";
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new answer
  const createAnswer = async (questionId: string, data: any) => {
    try {
      const answersService = useAnswersService();
      const response = await answersService.createAnswer(questionId, data);

      // Add the new answer to the list and sort by date (newest first)
      answers.value = [response, ...answers.value].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return response;
    } catch (err) {
      console.error("Error creating answer:", err);
      throw err;
    }
  };

  // Update an answer
  const updateAnswer = async (answerId: string, data: any) => {
    try {
      const answersService = useAnswersService();
      const response = await answersService.updateAnswer(answerId, data);

      // Update the answer in the list
      const index = answers.value.findIndex((a) => a.id === answerId);
      if (index !== -1) {
        answers.value[index] = { ...answers.value[index], ...response };
      }

      return response;
    } catch (err) {
      console.error("Error updating answer:", err);
      throw err;
    }
  };

  // Delete an answer
  const deleteAnswer = async (answerId: string) => {
    try {
      const answersService = useAnswersService();
      await answersService.deleteAnswer(answerId);

      // Remove the answer from the list
      answers.value = answers.value.filter((a) => a.id !== answerId);

      return true;
    } catch (err) {
      console.error("Error deleting answer:", err);
      throw err;
    }
  };

  // Create a reply to an answer
  const createReply = async (answerId: string, data: any) => {
    try {
      const answersService = useAnswersService();
      const response = await answersService.createReply(answerId, data);

      // Add the reply to the answer
      const answerIndex = answers.value.findIndex((a) => a.id === answerId);
      if (answerIndex !== -1) {
        if (!answers.value[answerIndex].replies) {
          answers.value[answerIndex].replies = [];
        }

        answers.value[answerIndex].replies.push(response);
      }

      return response;
    } catch (err) {
      console.error("Error creating reply:", err);
      throw err;
    }
  };

  return {
    answers,
    isLoading,
    error,
    fetchAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    createReply,
  };
}