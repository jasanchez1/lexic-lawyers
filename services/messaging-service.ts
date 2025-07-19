import { ApiService } from './api';
import type { User } from '~/types/user';
import type { Message, Conversation, MessageSendRequest } from '~/types/message';
import { useAuth } from '~/composables/useAuth';

export class MessagingService extends ApiService {
  async getConversations() {
    return this.request<Conversation[]>('/conversations', 'GET');
  }
  
  async getMessages(conversationId: string) {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`, 'GET');
  }
  
  async sendMessage(conversationId: string, data: MessageSendRequest) {
    return this.request<Message>(`/conversations/${conversationId}/messages`, 'POST', data);
  }
  
  async markAsRead(conversationId: string) {
    return this.request<{ success: boolean }>(`/conversations/${conversationId}/read`, 'POST');
  }
  
  // API endpoint for sending an initial message to a lawyer
  async sendInitialMessage(lawyerId: string, data: { content: string, name: string, email: string }) {
    return this.request<Message>(`/conversations/lawyers/${lawyerId}/messages`, 'POST', data);
  }
}

// Create a singleton instance
let messagingService: MessagingService;

export function useMessagingService() {
  if (!messagingService) {
    messagingService = new MessagingService();
  }
  
  return messagingService;
}