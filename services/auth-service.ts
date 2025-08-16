import { ApiService } from './api'
import type { TokenResponse, User } from '~/types/user'

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      // Call the login endpoint
      const url = `${this.getBaseUrl()}/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      // Check for error response
      if (!response.ok) {
        const errorData = await response.json();
        // Extract the detail message if available
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Parse successful response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error in AuthService:', error);
      
      // Re-throw with better formatting
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === 'object' && error !== null) {
        if (error.detail) {
          throw new Error(error.detail);
        } else {
          throw new Error('Credenciales inválidas');
        }
      } else {
        throw new Error('Error de autenticación');
      }
    }
  }
  
  // Get base URL from runtime config
  private getBaseUrl(): string {
    // Get config for base URL
    try {
      const config = useRuntimeConfig();
      return config.public.apiBaseUrl || 'http://localhost:8000';
    } catch (error) {
      console.error('Error getting config:', error);
      return 'http://localhost:8000';
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

  async requestPasswordReset(email: string): Promise<{success: boolean, message: string}> {
    try {
      const url = `${this.getBaseUrl()}/password-reset/request`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al solicitar restablecimiento de contraseña');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Password reset request error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al solicitar restablecimiento de contraseña');
    }
  }

  async validatePasswordResetToken(token: string): Promise<{success: boolean, message: string, expires_at?: string}> {
    try {
      const url = `${this.getBaseUrl()}/password-reset/validate-token`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Token inválido o expirado');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token validation error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Token inválido o expirado');
    }
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<{success: boolean, message: string}> {
    try {
      const url = `${this.getBaseUrl()}/password-reset/confirm`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, new_password: newPassword }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al restablecer contraseña');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al restablecer contraseña');
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