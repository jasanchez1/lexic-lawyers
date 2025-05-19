import { ref, readonly } from 'vue'
import { useAuthService } from '~/services/auth-service'
import { useLawyerService } from '~/services/lawyer-service'
import { 
  getAccessToken as getCookieAccessToken, 
  getRefreshToken, 
  storeTokens,
  clearTokens
} from '~/utils/cookies'
import { processAuthTransfer } from '~/utils/auth-transfer'

// State that will be shared between component instances
const isAuthenticated = ref(false)
const isLawyer = ref(false)
const user = ref(null)
const isLoading = ref(true)
const error = ref(null)

export function useAuth() {
  // Function to get the AuthService inside a component context
  const getAuthService = () => useAuthService();
  
  // Function to get the LawyerService inside a component context
  const getLawyerService = () => useLawyerService();
  
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const authService = getAuthService();
      const response = await authService.login(email, password)
      
      if (response.access_token) {
        // Store tokens in localStorage in the same format as main site
        storeTokens(
          response.access_token, 
          response.refresh_token,
          response.expires_in
        )
        
        // Get user info
        await fetchUserProfile()
        
        isAuthenticated.value = true
        return { success: true }
      } else {
        throw new Error('No access token received')
      }
    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Error de autenticación';
      
      // Properly format the error
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = err.toString();
      }
      
      error.value = errorMessage;
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      // Get the refresh token
      const refreshToken = getRefreshToken()
      
      if (refreshToken) {
        // Call the logout endpoint
        const authService = getAuthService();
        await authService.logout(refreshToken)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear all tokens
      clearTokens()
      
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
      const authService = getAuthService();
      const userData = await authService.getCurrentUser()
      user.value = userData
      
      // Check if user has lawyer profile
      isLawyer.value = userData.is_lawyer || userData.isLawyer
      
      return userData
    } catch (err) {
      console.error('Error fetching user profile:', err)
      error.value = err instanceof Error ? err.message : 'Error al obtener perfil'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const initAuth = async () => {
    isLoading.value = true
    
    try {
      console.log('Initializing auth...')
      
      // Skip on server-side
      if (process.server) {
        isLoading.value = false
        return
      }
      
      // Check for URL auth transfer first (new!)
      const transferSuccess = processAuthTransfer()
      if (transferSuccess) {
        console.log('Auth transferred via URL parameter')
      }
      
      // Check if we have a token
      const token = getAccessToken()
      console.log('Found access token:', token ? 'Yes' : 'No')
      
      if (token) {
        try {
          // Check if the token is valid by fetching the user profile
          await fetchUserProfile()
          isAuthenticated.value = true
          console.log('User profile fetched successfully, authenticated')
        } catch (err) {
          console.error('Error fetching user profile, trying to refresh token:', err)
          // Token might be invalid, try to refresh
          const refreshed = await refreshToken()
          console.log('Token refresh result:', refreshed ? 'Success' : 'Failed')
        }
      } else {
        console.log('No access token found, checking API status')
        // Check if we can login via the API's status endpoint
        // This helps detect if we're authenticated via cookies
        try {
          const authService = getAuthService();
          const isLoggedIn = await authService.isLoggedIn()
          console.log('Login status check result:', isLoggedIn ? 'Logged in' : 'Not logged in')
          
          if (isLoggedIn) {
            await fetchUserProfile()
            isAuthenticated.value = true
            console.log('Logged in via status check, user profile fetched')
          }
        } catch (err) {
          console.error('Error checking login status:', err)
        }
      }
    } catch (err) {
      console.error('Error in initAuth:', err)
    } finally {
      isLoading.value = false
    }
  }

  const refreshToken = async () => {
    if (process.server) return false
    
    // Get the refresh token
    const refreshToken = getRefreshToken()
    
    if (!refreshToken) {
      console.log('No refresh token found')
      isAuthenticated.value = false
      isLawyer.value = false
      return false
    }
    
    try {
      console.log('Attempting to refresh token...')
      const authService = getAuthService();
      const response = await authService.refreshToken(refreshToken)
      
      if (response.access_token && response.refresh_token) {
        console.log('Token refresh successful, storing new tokens')
        // Store the new tokens
        storeTokens(
          response.access_token,
          response.refresh_token,
          response.expires_in
        )
        
        // Get user info
        await fetchUserProfile()
        
        isAuthenticated.value = true
        return true
      } else {
        console.error('Token refresh response missing tokens', response)
        return false
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      
      // Clear invalid tokens
      clearTokens()
      isAuthenticated.value = false
      isLawyer.value = false
      return false
    }
  }

  // Added method to get the access token
  const getAccessToken = () => {
    return getCookieAccessToken();
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
    refreshToken,
    getAccessToken
  }
}