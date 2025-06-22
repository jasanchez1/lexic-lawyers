import { useProfile } from '~/composables/useProfile'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, isLawyer, isLoading, user, initAuth } = useAuth()
  
  // Skip during SSR
  if (process.server) return
  
  // Initialize auth first
  await initAuth()
  
  // Wait until auth is no longer loading
  if (isLoading.value) return
  
  // If not authenticated or not a lawyer, redirect to login
  if (!isAuthenticated.value || !isLawyer.value) {
    return navigateTo('/login')
  }
  
  // Check if the lawyer has completed their profile setup
  if (!user.value?.lawyer_id && to.path !== '/create-lawyer-profile') {
    // User is a lawyer but doesn't have a lawyer profile yet - redirect to profile creation
    return navigateTo('/create-lawyer-profile')
  }
  
  // Check if the lawyer is verified (skip for verification-pending page itself)
  if (user.value?.lawyer_id && to.path !== '/verification-pending') {
    // We need to fetch the lawyer profile to check verification status
    try {
      const { profile, fetchProfile } = useProfile()
      
      // Only fetch if we don't have the profile already
      if (!profile.value) {
        await fetchProfile()
      }
      
      // Check if lawyer is verified
      if (profile.value && !profile.value.is_verified) {
        return navigateTo('/verification-pending')
      }
    } catch (error) {
      console.error('Error checking lawyer verification status:', error)
      // If there's an error, we'll let them through and handle it on the page
    }
  }
})