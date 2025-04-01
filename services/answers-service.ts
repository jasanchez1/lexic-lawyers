import { ApiService } from './api'

export class AnswersService extends ApiService {
  async getAnswers(questionId: string) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/questions/${questionId}/answers`, 'GET')
    
    // Mock data
    return [
      {
        id: 'a1',
        questionId: '1',
        content: 'La posesión efectiva es el trámite mediante el cual los herederos son reconocidos legalmente como tales. El procedimiento varía dependiendo de si hay o no testamento. Para posesión efectiva sin testamento, debe presentar su solicitud en el Registro Civil junto con certificados de nacimiento, defunción y matrimonio del causante, y más documentos dependiendo del caso específico.',
        date: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        lawyerId: 'lawyer1',
        author: {
          id: 'lawyer1',
          name: 'Roberto Gómez',
          title: 'Abogado Civil',
          isVerified: true
        },
        isAccepted: false,
        helpfulCount: 2,
        isHelpful: false,
        replies: []
      },
      {
        id: 'a2',
        questionId: '1',
        content: 'Para complementar la respuesta anterior, los documentos básicos que necesitará son: Certificado de defunción del causante, certificados de nacimiento de los herederos, certificado de matrimonio si corresponde, y un inventario valorizado de los bienes dejados por el causante. El trámite puede hacerse en el Registro Civil si no hay testamento (intestada) o ante un Conservador de Bienes Raíces si hay testamento (testada).',
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        lawyerId: 'lawyer2',
        author: {
          id: 'lawyer2',
          name: 'Carmen Jiménez',
          title: 'Abogada Especialista en Herencias',
          isVerified: true
        },
        isAccepted: false,
        helpfulCount: 3,
        isHelpful: true,
        replies: [
          {
            id: 'r1',
            content: 'Gracias por su respuesta. ¿Debo pagar algún impuesto por la herencia?',
            date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            author: {
              id: 'user1',
              name: 'Juan Pérez'
            }
          },
          {
            id: 'r2',
            content: 'Sí, en Chile existe un impuesto a las herencias. Este impuesto se aplica a herencias cuyo monto total supere las 50 UTA (aproximadamente $30 millones). La tasa va desde el 1% hasta el 25% dependiendo del monto heredado y el grado de parentesco con el causante.',
            date: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            author: {
              id: 'lawyer2',
              name: 'Carmen Jiménez'
            }
          }
        ]
      }
    ]
  }
  
  async createAnswer(questionId: string, data: any) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/questions/${questionId}/answers`, 'POST', data)
    
    // Mock response - creating a new answer
    return {
      id: 'new-answer-' + Date.now(),
      questionId,
      content: data.content,
      date: new Date().toISOString(),
      lawyerId: data.lawyerId,
      author: {
        id: data.lawyerId,
        name: 'Tú', // This would be fetched from user profile in a real app
        title: 'Abogado', // This would be fetched from user profile in a real app
        isVerified: true
      },
      isAccepted: false,
      helpfulCount: 0,
      isHelpful: false,
      replies: []
    }
  }
  
  async updateAnswer(answerId: string, data: any) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/answers/${answerId}`, 'PATCH', data)
    
    // Mock response - updating an existing answer
    return {
      id: answerId,
      content: data.content,
      // Other fields would be preserved from the original answer
      updatedAt: new Date().toISOString()
    }
  }
  
  async deleteAnswer(answerId: string) {
    // For development, return mock success
    // In production, use:
    // return this.request(`/answers/${answerId}`, 'DELETE')
    
    // Mock successful deletion
    return { success: true }
  }
  
  async createReply(answerId: string, data: any) {
    // For development, return mock data
    // In production, use:
    // return this.request(`/answers/${answerId}/replies`, 'POST', data)
    
    // Mock response - creating a new reply
    return {
      id: 'new-reply-' + Date.now(),
      answerId,
      content: data.content,
      date: new Date().toISOString(),
      author: {
        id: 'current-user', // This would be fetched from auth state in a real app
        name: 'Tú', // This would be fetched from user profile in a real app
      }
    }
  }
}

// Create a singleton instance
let answersService: AnswersService

export function useAnswersService() {
  if (!answersService) {
    answersService = new AnswersService()
  }
  
  return answersService
}