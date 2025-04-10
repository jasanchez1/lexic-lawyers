import { ref, readonly } from 'vue'
import { useAuthService } from '~/services/auth-service'
import { useLawyerService } from '~/services/lawyer-service'

// State that will be shared between component instances
const isAuthenticated = ref(false)
const isLawyer = ref(false)
const user = ref(null)
const isLoading = ref(true)
const error = ref(null)

export function useAuth() {
  const authService = useAuthService()
  const lawyerService = useLawyerService()
  
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(email, password)
      
      if (response.access_token) {
        // Store tokens in localStorage (browser-only)
        if (process.client) {
          localStorage.setItem('accessToken', response.access_token)
          localStorage.setItem('refreshToken', response.refresh_token)
        }
        
        // Get user info
        await fetchUserProfile()
        
        isAuthenticated.value = true
        return { success: true }
      } else {
        throw new Error('No access token received')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Error de autenticación'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      if (process.client) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          await authService.logout({ refresh_token: refreshToken })
        }
        
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear user data regardless of API call success
      user.value = null
      isAuthenticated.value = false
      isLawyer.value = false
      isLoading.value = false
    }
  }

  const fetchUserProfile = async () => {
    isLoading.value = true
    
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      
      // Check if user has lawyer profile
      isLawyer.value = !!userData.lawyer_id
      
      return userData
    } catch (err) {
      console.error('Error fetching user profile:', err)
      error.value = err.message || 'Error al obtener perfil'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const initAuth = async () => {
    isLoading.value = true
    
    // Skip on server-side
    if (!process.client) {
      isLoading.value = false
      return
    }
    
    // Check if we have a token
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      try {
        await fetchUserProfile()
        isAuthenticated.value = true
      } catch (err) {
        // Token might be invalid, try to refresh
        await refreshToken()
      }
    }
    
    isLoading.value = false
  }

  const refreshToken = async () => {
    if (!process.client) return false
    
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      isAuthenticated.value = false
      isLawyer.value = false
      return false
    }
    
    try {
      const response = await authService.refreshToken({ refresh_token: refreshToken })
      
      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token)
        localStorage.setItem('refreshToken', response.refresh_token)
        
        // Get user info
        await fetchUserProfile()
        
        isAuthenticated.value = true
        return true
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      
      // Clear invalid tokens
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      isAuthenticated.value = false
      isLawyer.value = false
    }
    
    return false
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLawyer: readonly(isLawyer),
    isLoading: readonly(isLoading),
    error: readonly(error),
    login,
    logout,
    fetchUserProfile,
    initAuth,
    refreshToken
  }
}
