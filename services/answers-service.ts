import { ApiService } from './api';
import type { Answer, AnswerCreate, AnswerUpdate, Reply, ReplyCreate } from '~/types/question';

export class AnswersService extends ApiService {
  async getAnswers(questionId: string) {
    return this.request<Answer[]>(`/questions/${questionId}/answers`, 'GET');
  }
  
  async createAnswer(questionId: string, data: AnswerCreate) {
    return this.request<Answer>(`/questions/${questionId}/answers`, 'POST', data);
  }
  
  async updateAnswer(answerId: string, data: AnswerUpdate) {
    return this.request<Answer>(`/answers/${answerId}`, 'PATCH', data);
  }
  
  async deleteAnswer(answerId: string) {
    return this.request(`/answers/${answerId}`, 'DELETE');
  }
  
  async createReply(answerId: string, data: ReplyCreate) {
    return this.request<Reply>(`/answers/${answerId}/replies`, 'POST', data);
  }
  
  async markAnswerHelpful(answerId: string) {
    return this.request<{ success: boolean; is_helpful: boolean; helpful_count: number }>(`/answers/${answerId}/helpful`, 'POST');
  }
  
  async acceptAnswer(answerId: string) {
    return this.request<Answer>(`/answers/${answerId}/accept`, 'POST');
  }
}

// Create a singleton instance
let answersService: AnswersService;

export function useAnswersService() {
  if (!answersService) {
    answersService = new AnswersService();
  }
  
  return answersService;
}