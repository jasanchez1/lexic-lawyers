import { ApiService } from './api'

export class AuthService extends ApiService {
  async login(email: string, password: string) {
    return this.request('/auth/login', 'POST', { email, password })
  }
  
  async logout(data: { refresh_token: string }) {
    return this.request('/auth/logout', 'POST', data)
  }
  
  async refreshToken(data: { refresh_token: string }) {
    return this.request('/auth/refresh', 'POST', data)
  }
  
  async getCurrentUser() {
    return this.request('/auth/me', 'GET')
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