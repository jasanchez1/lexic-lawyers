import { ApiService } from './api'

export class QuestionsService extends ApiService {
  async getQuestions(params: any = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.status) {
      if (params.status === 'unanswered') {
        // Specific query for unanswered questions
        queryParams.append('answered', 'false')
      } else if (params.status === 'answered') {
        queryParams.append('answered', 'true')
      }
    }
    
    if (params.area) {
      queryParams.append('area', params.area)
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString())
    }
    
    if (params.size) {
      queryParams.append('size', params.size.toString())
    }
    
    // For development, return mock data
    // In production, use:
    // return this.request(`/questions?${queryParams.toString()}`, 'GET')
    
    // Mock data
    return {
      questions: [
        {
          id: '1',
          title: '¿Cómo puedo realizar una posesión efectiva?',
          content: 'Necesito realizar una posesión efectiva debido al fallecimiento de mi padre. ¿Cuál es el procedimiento y qué documentos necesito?',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          location: 'Santiago',
          viewCount: 45,
          answerCount: 2,
          topics: [
            { id: '1', name: 'Herencias', slug: 'herencias' },
            { id: '2', name: 'Posesión Efectiva', slug: 'posesion-efectiva' }
          ],
          planToHire: 'yes'
        },
        {
          id: '2',
          title: 'Problema con contrato de arriendo',
          content: 'Mi arrendador quiere subir el precio del arriendo en más de un 20% y dice que si no acepto tendré que irme. ¿Es esto legal? ¿Qué puedo hacer?',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          location: 'Viña del Mar',
          viewCount: 32,
          answerCount: 0,
          topics: [
            { id: '3', name: 'Arrendamiento', slug: 'arrendamiento' },
            { id: '4', name: 'Contratos', slug: 'contratos' }
          ],
          planToHire: 'maybe'
        },
        {
          id: '3',
          title: 'Demanda por deuda impaga',
          content: 'Un cliente no me ha pagado por servicios profesionales realizados hace más de 6 meses. ¿Cómo puedo proceder con una demanda por deuda impaga?',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          location: 'Concepción',
          viewCount: 17,
          answerCount: 1,
          topics: [
            { id: '5', name: 'Cobranza', slug: 'cobranza' },
            { id: '6', name: 'Procedimientos Judiciales', slug: 'procedimientos-judiciales' }
          ],
          planToHire: 'yes'
        }
      ],
      total: 28,
      page: params.page || 1,
      size: params.size || 10,
      pages: Math.ceil(28 / (params.size || 10))
    }
  }
  
  async getQuestion(id: string) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/questions/${id}`, 'GET')
    
    // Mock data based on ID
    const mockQuestions = {
      '1': {
        id: '1',
        title: '¿Cómo puedo realizar una posesión efectiva?',
        content: 'Necesito realizar una posesión efectiva debido al fallecimiento de mi padre. ¿Cuál es el procedimiento y qué documentos necesito?',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        location: 'Santiago',
        viewCount: 45,
        answerCount: 2,
        topics: [
          { id: '1', name: 'Herencias', slug: 'herencias' },
          { id: '2', name: 'Posesión Efectiva', slug: 'posesion-efectiva' }
        ],
        planToHire: 'yes',
        author: {
          name: 'Juan Pérez',
          location: 'Santiago'
        }
      },
      '2': {
        id: '2',
        title: 'Problema con contrato de arriendo',
        content: 'Mi arrendador quiere subir el precio del arriendo en más de un 20% y dice que si no acepto tendré que irme. El contrato de arriendo que firmamos es por un año y llevo 8 meses viviendo en el departamento. ¿Es legal esta alza tan drástica? ¿Qué derechos tengo como arrendatario?',
        date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        location: 'Viña del Mar',
        viewCount: 32,
        answerCount: 0,
        topics: [
          { id: '3', name: 'Arrendamiento', slug: 'arrendamiento' },
          { id: '4', name: 'Contratos', slug: 'contratos' }
        ],
        planToHire: 'maybe',
        author: {
          name: 'María González',
          location: 'Viña del Mar'
        }
      },
      '3': {
        id: '3',
        title: 'Demanda por deuda impaga',
        content: 'Un cliente no me ha pagado por servicios profesionales realizados hace más de 6 meses. He intentado contactarlo múltiples veces, le he enviado recordatorios de pago y finalmente una carta de cobro formal, pero sigue sin responder. El monto adeudado es de $1.500.000. ¿Cómo puedo proceder con una demanda por deuda impaga?',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        location: 'Concepción',
        viewCount: 17,
        answerCount: 1,
        topics: [
          { id: '5', name: 'Cobranza', slug: 'cobranza' },
          { id: '6', name: 'Procedimientos Judiciales', slug: 'procedimientos-judiciales' }
        ],
        planToHire: 'yes',
        author: {
          name: 'Carlos Rodríguez',
          location: 'Concepción'
        }
      }
    }
    
    // Return the question or throw error if not found
    if (mockQuestions[id]) {
      return mockQuestions[id]
    } else {
      throw new Error('Pregunta no encontrada')
    }
  }
}

// Create a singleton instance
let questionsService: QuestionsService

export function useQuestionsService() {
  if (!questionsService) {
    questionsService = new QuestionsService()
  }
  
  return questionsService
}