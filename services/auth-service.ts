
import { ApiService } from './api'
import type { TokenResponse, User } from '~/types/user'

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      return await this.request<TokenResponse>('/auth/login', 'POST', { email, password });
    } catch (error) {
      // Transform the error for better display
      if (error instanceof Error) {
        // If it's already an Error object, just rethrow it
        throw error;
      } else if (typeof error === 'object' && error !== null) {
        // If it's an object but not an Error, try to get a message property
        if (error.message) {
          throw new Error(error.message);
        } else if (error.detail) {
          throw new Error(error.detail);
        } else {
          // Try to stringify the object for display
          try {
            throw new Error(JSON.stringify(error));
          } catch (e) {
            // If JSON stringify fails
            throw new Error('Error de autenticación. Credenciales inválidas.');
          }
        }
      } else {
        // If it's not an object, convert to string
        throw new Error(String(error) || 'Error de autenticación. Credenciales inválidas.');
      }
    }
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
let authService: AuthService;

export function useAuthService() {
  if (!authService) {
    authService = new AuthService();
  }
  
  return authService;
}