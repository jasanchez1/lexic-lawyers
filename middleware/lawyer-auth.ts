export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, isLawyer, isLoading, initAuth } = useAuth()
  
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
})
