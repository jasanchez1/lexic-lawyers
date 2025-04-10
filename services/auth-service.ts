import { ApiService } from './api'
import type { TokenResponse, User } from '~/types/user'

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<TokenResponse> {
    console.log('AuthService login with:', email)
    return this.request<TokenResponse>('/auth/login', 'POST', { email, password });
  }
  
  async logout(data: { refresh_token: string }): Promise<any> {
    return this.request('/auth/logout', 'POST', data);
  }
  
  async refreshToken(data: { refresh_token: string }): Promise<TokenResponse> {
    return this.request<TokenResponse>('/auth/refresh', 'POST', data);
  }
  
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me', 'GET');
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
