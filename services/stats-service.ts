import { ApiService } from './api'

export class StatsService extends ApiService {
  async getDashboardStats() {
    // Mock data for now, replace with actual API call
    // return this.request('/analytics/summary', 'GET')
    
    // Mock data for development
    return {
      profileViews: 132,
      newQuestions: 8,
      totalAnswers: 65,
      rating: 4.7,
      responseRate: 92,
      avgResponseTime: 8, // hours
      profileImpressions: 547,
      contactRequests: 24
    }
  }
  
  async getRecentActivity() {
    // Mock data for now, replace with actual API call
    // return this.request('/analytics/recent-activity', 'GET')
    
    // Mock data for development
    return {
      activities: [
        {
          type: 'view',
          description: 'Tu perfil fue visto por un nuevo usuario',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          actionUrl: '/statistics'
        },
        {
          type: 'question',
          description: 'Recibiste una nueva pregunta sobre "Consulta por divorcio"',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          actionUrl: '/questions/some-id-1'
        },
        {
          type: 'message',
          description: 'Nuevo mensaje de María González',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          actionUrl: '/messages?conversation=some-id-1'
        },
        {
          type: 'review',
          description: 'Recibiste una nueva reseña de 5 estrellas',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          actionUrl: '/reviews'
        },
        {
          type: 'answer',
          description: 'Tu respuesta fue marcada como útil',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
          actionUrl: '/questions/some-id-2'
        }
      ],
      questions: [
        {
          id: 'q1',
          title: '¿Cuál es el procedimiento para una posesión efectiva?',
          date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          location: 'Santiago'
        },
        {
          id: 'q2',
          title: 'Tengo un problema con mi empleador, ¿qué puedo hacer?',
          date: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          location: 'Concepción'
        },
        {
          id: 'q3',
          title: 'Consulta sobre división de bienes en un divorcio',
          date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
          location: 'Valparaíso'
        }
      ]
    }
  }
  
  async getProfileStats(period = 'week') {
    // Mock data for now
    // return this.request(`/analytics/profile-stats?period=${period}`, 'GET')
    
    // Will be implemented later in the profile stats page
    return {}
  }
}

// Create a singleton instance
let statsService: StatsService

export function useStatsService() {
  if (!statsService) {
    statsService = new StatsService()
  }
  
  return statsService
}