const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'

export class ApiService {
  protected async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const accessToken = localStorage.getItem('accessToken')
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }
    
    if (accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${accessToken}`
    }
    
    const url = `${BASE_URL}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: 'include',
    }
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }
    
    try {
      const response = await fetch(url, options)
      
      // Check if the response is 401 Unauthorized
      if (response.status === 401) {
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
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }
      
      // Parse response as JSON or return empty object if no content
      if (response.status !== 204) {
        return await response.json()
      } else {
        return {} as T
      }
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error)
      throw error
    }
  }
  
  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      return false
    }
    
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        return true
      } else {
        // If refresh fails, clear tokens
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return false
    }
  }
}