export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated, isLawyer, isLoading } = useAuth()
    
    // Skip during SSR
    if (process.server) return
    
    // Wait until auth is no longer loading
    if (isLoading.value) return
    
    // If not authenticated or not a lawyer, redirect to login
    if (!isAuthenticated.value || !isLawyer.value) {
      return navigateTo('/login')
    }
  })