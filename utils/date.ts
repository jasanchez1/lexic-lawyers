/**
 * Format date in relative time (e.g., "2 days ago", "Just now")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffSec < 60) {
      return 'Justo ahora'
    } else if (diffMin < 60) {
      return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHour < 24) {
      return `Hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`
    } else if (diffDay < 7) {
      return `Hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`
    } else {
      return formatDate(dateString)
    }
  }
  
  /**
   * Format date in standard format (e.g., "12 de enero de 2023")
   */
  export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }
  
  /**
   * Calculate years of experience from a start date
   */
  export function calculateYearsOfExperience(startDateString?: string): number {
    if (!startDateString) return 0
    
    const startDate = new Date(startDateString)
    const now = new Date()
    
    return now.getFullYear() - startDate.getFullYear()
  }