export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on client-side
  if (process.server) return
  
  // Initialize auth state on app start
  const { initAuth } = useAuth()
  await initAuth()
})
