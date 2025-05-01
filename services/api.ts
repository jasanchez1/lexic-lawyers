import { 
  getToken, 
  getRefreshToken, 
  storeTokens, 
  clearTokens 
} from '~/utils/cookies'

export class ApiService {
  protected async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    // Get base URL from env or use default
    const config = useRuntimeConfig()
    const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }
    
    // Only add authorization header in client-side
    if (process.client) {
      const token = getToken()
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
      }
    }
    
    const url = `${BASE_URL}${endpoint}`    
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: 'include', // Include cookies in request (critical for cross-domain auth)
    }
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }
    
    try {
      const response = await fetch(url, options)      
      // Check if the response is 401 Unauthorized
      if (response.status === 401 && process.client) {
        // Try to refresh the token
        const refreshed = await this.refreshToken()
        
        if (refreshed) {
          // Retry the request with the new token
          return this.request(endpoint, method, data, headers)
        } else {
          // Redirect to login
          window.location.href = '/login'
          throw new Error('Sesión expirada')
        }
      }
      
      // Check for other error responses
      if (!response.ok) {
        console.error('API Error response:', response.status, response.statusText)
        let errorData = {}
        try {
          errorData = await response.json()
          console.error('Error data:', errorData)
        } catch (e) {
          console.error('Failed to parse error response')
        }
        
        const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }
      
      // Parse response as JSON or return empty object if no content
      if (response.status !== 204) {
        const jsonResponse = await response.json()
        return jsonResponse as T
      } else {
        return {} as T
      }
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error)
      throw error
    }
  }
  
  private async refreshToken(): Promise<boolean> {
    if (!process.client) return false
    
    // Get config for base URL
    const config = useRuntimeConfig()
    const BASE_URL = config.public.apiBaseUrl || 'http://localhost:8000'
    
    // Get refresh token 
    const refreshToken = getRefreshToken()
    
    if (!refreshToken) {
      return false
    }
    
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // FIXED: Send the actual refresh token, not the base URL
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include' // Include cookies in request
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Store tokens in cookies and localStorage
        storeTokens(data.access_token, data.refresh_token)
        
        return true
      } else {
        // If refresh fails, clear tokens
        clearTokens()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      
      // Clear tokens
      clearTokens()
      
      return false
    }
  }
}