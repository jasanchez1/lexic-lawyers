import { ApiService } from './api'
import type { TokenResponse, User } from '~/types/user'

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/login', 'POST', { email, password });
  }
  
  async logout(refreshToken: string): Promise<any> {
    return this.request('/auth/logout', 'POST', { refresh_token: refreshToken });
  }
  
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/refresh', 'POST', { refresh_token: refreshToken });
  }
  
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me', 'GET');
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      // Just make a lightweight request to verify authentication
      await this.request<{status: string}>('/auth/status', 'GET');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create a singleton instance
let authService: AuthService

export function useAuthService() {
  if (!authService) {
    authService = new AuthService()
  }
  
  return authService
}