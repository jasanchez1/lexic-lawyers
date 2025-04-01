import { ref } from 'vue'
import { useMessagingService } from '~/services/messaging-service'

export function useMessaging() {
  const messagingService = useMessagingService()
  
  const conversations = ref([])
  const currentMessages = ref([])
  const isLoading = ref(false)
  const isLoadingMessages = ref(false)
  const error = ref(null)
  
  // Fetch all conversations
  const fetchConversations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await messagingService.getConversations()
      conversations.value = response || []
      return conversations.value
    } catch (err) {
      console.error('Error fetching conversations:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar conversaciones'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    isLoadingMessages.value = true
    
    try {
      const response = await messagingService.getMessages(conversationId)
      currentMessages.value = response || []
      return currentMessages.value
    } catch (err) {
      console.error('Error fetching messages:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar mensajes'
      return []
    } finally {
      isLoadingMessages.value = false
    }
  }
  
  // Send a new message
  const sendNewMessage = async (conversationId: string, content: string) => {
    try {
      const response = await messagingService.sendMessage(conversationId, { content })
      
      // Add the new message to the current messages
      currentMessages.value.push(response)
      
      // Update the conversation in the list
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].lastMessage = content
        conversations.value[conversationIndex].lastMessageDate = new Date().toISOString()
        
        // Move this conversation to the top of the list
        const conversation = conversations.value.splice(conversationIndex, 1)[0]
        conversations.value.unshift(conversation)
      }
      
      return response
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }
  
  // Mark a conversation as read
  const markConversationAsRead = async (conversationId: string) => {
    try {
      const response = await messagingService.markAsRead(conversationId)
      
      // Update the conversation in the list
      const conversationIndex = conversations.value.findIndex(c => c.id === conversationId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].unreadCount = 0
      }
      
      return response
    } catch (err) {
      console.error('Error marking conversation as read:', err)
      throw err
    }
  }
  
  return {
    conversations,
    currentMessages,
    isLoading,
    isLoadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    markConversationAsRead
  }
}