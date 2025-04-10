import { ApiService } from './api';
import type { Question, QuestionsList, QuestionCreate, QuestionUpdate } from '~/types/question';

export class QuestionsService extends ApiService {
  async getQuestions(params: { status?: string; area?: string; page?: number; size?: number; sort?: string; }) {
    const queryParams = new URLSearchParams();
    
    if (params.status && params.status !== 'all') {
      // Map our frontend states to API states
      if (params.status === 'unanswered') {
        queryParams.append('answered', 'false');
      } else if (params.status === 'answered') {
        queryParams.append('answered', 'true');
      }
    }
    
    if (params.area) {
      queryParams.append('area', params.area);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    
    return this.request<QuestionsList>(`/questions?${queryParams.toString()}`, 'GET');
  }
  
  async getQuestion(id: string) {
    return this.request<Question>(`/questions/${id}`, 'GET');
  }
  
  async createQuestion(data: QuestionCreate) {
    return this.request<Question>('/questions', 'POST', data);
  }
  
  async updateQuestion(id: string, data: QuestionUpdate) {
    return this.request<Question>(`/questions/${id}`, 'PATCH', data);
  }
  
  async deleteQuestion(id: string) {
    return this.request(`/questions/${id}`, 'DELETE');
  }
}

// Create a singleton instance
let questionsService: QuestionsService;

export function useQuestionsService() {
  if (!questionsService) {
    questionsService = new QuestionsService();
  }
  
  return questionsService;
}