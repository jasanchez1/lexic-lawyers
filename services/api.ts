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
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`
      }
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
      if (response.status === 401 && process.client) {
        // Try to refresh the token
        const refreshed = await this.refreshToken(BASE_URL)
        
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
  
  private async refreshToken(baseUrl: string): Promise<boolean> {
    if (!process.client) return false
    
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      return false
    }
    
    try {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
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
