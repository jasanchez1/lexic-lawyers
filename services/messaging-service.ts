import { ApiService } from './api'

export class MessagingService extends ApiService {
  async getConversations() {
    // In production, use:
    // return this.request('/conversations', 'GET')
    
    // Mock data
    return [
      {
        id: 'c1',
        client: {
          id: 'user1',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          imageUrl: null
        },
        lastMessage: 'Gracias por su respuesta, me ha sido de gran ayuda.',
        lastMessageDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        unreadCount: 1
      },
      {
        id: 'c2',
        client: {
          id: 'user2',
          name: 'María González',
          email: 'maria.gonzalez@example.com',
          imageUrl: null
        },
        lastMessage: 'Buenas tardes, ¿podría agendar una consulta para la próxima semana?',
        lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        unreadCount: 0
      },
      {
        id: 'c3',
        client: {
          id: 'user3',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@example.com',
          imageUrl: null
        },
        lastMessage: 'Perfecto, nos vemos el jueves a las 15:00 hrs.',
        lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        unreadCount: 0
      }
    ]
  }
  
  async getMessages(conversationId: string) {
    // In production, use:
    // return this.request(`/conversations/${conversationId}/messages`, 'GET')
    
    // Mock data - different messages for each conversation
    const mockMessages = {
      'c1': [
        {
          id: 'm1-1',
          conversationId: 'c1',
          content: 'Hola, tengo una duda respecto a un problema de arrendamiento. Mi arrendador quiere aumentar el precio del arriendo en un 20% y dice que si no acepto tendré que irme en 30 días. ¿Es esto legal?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          fromLawyer: false,
          read: true
        },
        {
          id: 'm1-2',
          conversationId: 'c1',
          content: 'Buenos días. Según la ley de arrendamiento en Chile, el aumento de precio anual debe estar estipulado en el contrato, y generalmente se ajusta según el IPC. Un aumento del 20% es inusual a menos que esté previamente acordado. En cuanto al plazo de desalojo, si su contrato es indefinido, el arrendador debe dar aviso con al menos 2 meses de anticipación. Le recomendaría revisar su contrato y podemos coordinar una consulta para analizar su caso específico.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
          fromLawyer: true,
          read: true
        },
        {
          id: 'm1-3',
          conversationId: 'c1',
          content: 'Gracias por su respuesta, me ha sido de gran ayuda.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          fromLawyer: false,
          read: false
        }
      ],
      'c2': [
        {
          id: 'm2-1',
          conversationId: 'c2',
          content: 'Buenas tardes, necesito asesoría legal para un tema de derecho laboral. He sido despedido y creo que fue injustificado.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          fromLawyer: false,
          read: true
        },
        {
          id: 'm2-2',
          conversationId: 'c2',
          content: 'Buenas tardes, lamento escuchar sobre su situación. Para poder asesorarle adecuadamente, necesitaría conocer más detalles. ¿Podría indicarme cuánto tiempo trabajó en la empresa y cuál fue la causal de despido señalada?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          fromLawyer: true,
          read: true
        },
        {
          id: 'm2-3',
          conversationId: 'c2',
          content: 'Trabajé 3 años y 5 meses. Me despidieron por "necesidades de la empresa", pero una semana después contrataron a alguien más para mi mismo puesto.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          fromLawyer: false,
          read: true
        },
        {
          id: 'm2-4',
          conversationId: 'c2',
          content: 'En base a lo que me comenta, efectivamente podríamos estar ante un despido injustificado. La causal de "necesidades de la empresa" no aplicaría si contrataron a alguien más para el mismo puesto. Esto podría dar lugar a un aumento en sus indemnizaciones. Me gustaría revisar su caso con más detalle. ¿Le parece coordinar una reunión?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
          fromLawyer: true,
          read: true
        },
        {
          id: 'm2-5',
          conversationId: 'c2',
          content: 'Buenas tardes, ¿podría agendar una consulta para la próxima semana?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          fromLawyer: false,
          read: true
        }
      ],
      'c3': [
        {
          id: 'm3-1',
          conversationId: 'c3',
          content: 'Hola, necesito ayuda con un tema de pensión alimenticia.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
          fromLawyer: false,
          read: true
        },
        {
          id: 'm3-2',
          conversationId: 'c3',
          content: 'Buenos días. Con gusto puedo ayudarle con su consulta sobre pensión alimenticia. ¿Podría proporcionarme más detalles? ¿Es usted quien solicita la pensión o quien debe pagarla?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
          fromLawyer: true,
          read: true
        },
        {
          id: 'm3-3',
          conversationId: 'c3',
          content: 'Soy quien la solicita. Tengo 2 hijos de 8 y 10 años, y mi ex pareja no ha pagado la pensión en los últimos 3 meses.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
          fromLawyer: false,
          read: true
        },
        {
          id: 'm3-4',
          conversationId: 'c3',
          content: 'Entiendo la situación. En estos casos, podemos iniciar acciones legales por el no pago de la pensión alimenticia. Existe la posibilidad de solicitar apremios como el arresto nocturno o incluso la retención de la devolución de impuestos. Para avanzar, necesitaría revisar la resolución judicial que estableció la pensión. ¿Le parece agendar una reunión para el jueves a las 15:00 hrs?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.2).toISOString(),
          fromLawyer: true,
          read: true
        },
        {
          id: 'm3-5',
          conversationId: 'c3',
          content: 'Perfecto, nos vemos el jueves a las 15:00 hrs.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          fromLawyer: false,
          read: true
        }
      ]
    }
    
    // Return messages for the requested conversation or an empty array
    return mockMessages[conversationId] || []
  }
  
  async sendMessage(conversationId: string, data: any) {
    // In production, use:
    // return this.request(`/conversations/${conversationId}/messages`, 'POST', data)
    
    // Mock response for a sent message
    return {
      id: 'new-message-' + Date.now(),
      conversationId,
      content: data.content,
      timestamp: new Date().toISOString(),
      fromLawyer: true,
      read: true
    }
  }
  
  async markAsRead(conversationId: string) {
    // In production, use:
    // return this.request(`/conversations/${conversationId}/read`, 'POST')
    
    // Mock success response
    return { success: true }
  }
}

// Create a singleton instance
let messagingService: MessagingService

export function useMessagingService() {
  if (!messagingService) {
    messagingService = new MessagingService()
  }
  
  return messagingService
}