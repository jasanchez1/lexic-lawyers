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
})